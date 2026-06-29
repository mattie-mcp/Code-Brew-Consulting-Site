/**
 * Resume-request & contact form backend.
 *
 * Flow: validate → spam-guard (honeypot + timing + per-IP rate limit) → fetch the
 * resume from private S3 → email it to the requester (PDF attached + personal blurb)
 * → notify the owner of the lead. All via AWS SDK v3, which ships in the Lambda
 * Node.js 20 runtime, so this handler needs no bundling and no dependencies.
 *
 * The whole feature sits behind FEATURE_ENABLED: when it isn't exactly "true" the
 * handler short-circuits BEFORE touching S3/SES/DynamoDB, so a stray request can't
 * run up cost. See docs/infrastructure.md for how to flip and check the flag.
 *
 * Env vars (set in the CDK stack):
 *   FEATURE_ENABLED   "true" to enable; anything else disables the feature
 *   RESUME_BUCKET     private S3 bucket holding the resume PDF
 *   RESUME_KEY        S3 key of the resume PDF
 *   RESUME_FILENAME   filename the requester sees on the attachment
 *   FROM_EMAIL        verified SES sender, e.g. "Mattie Phillips <hello@codebrewconsulting.com>"
 *   REPLY_TO          where requester replies should go (Mattie's inbox)
 *   NOTIFY_EMAIL      lead-notification recipient (Mattie's inbox)
 *   RATE_TABLE        DynamoDB table name for per-IP rate limiting
 *   RATE_LIMIT        max submissions per IP per window (default 5)
 *   RATE_WINDOW_SEC   rate-limit window in seconds (default 3600)
 *   MIN_SUBMIT_MS     minimum time-on-form before a submit is trusted (default 2500)
 */

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import {
  DynamoDBClient,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

const s3 = new S3Client({});
const ses = new SESv2Client({});
const ddb = new DynamoDBClient({});

const RATE_LIMIT = Number(process.env.RATE_LIMIT || 5);
const RATE_WINDOW_SEC = Number(process.env.RATE_WINDOW_SEC || 3600);
const MIN_SUBMIT_MS = Number(process.env.MIN_SUBMIT_MS || 2500);

const REASON_LABELS = {
  hiring: "Hiring for a role",
  recruiting: "Recruiting / sourcing",
  networking: "Networking / staying in touch",
  consulting: "Consulting or contract inquiry",
  hello: "Just saying hello",
  other: "Other",
};

// ---------------------------------------------------------------------------
// Copy — honest, in Mattie's voice. Safe to edit (Content & Copy Writer owns).
// ---------------------------------------------------------------------------
const DELIVERY_SUBJECT = "My resume — thanks for reaching out";

function deliveryText(name) {
  const first = (name || "").trim().split(/\s+/)[0] || "there";
  return `Hi ${first},

Thanks for asking — my resume is attached. I kept the site light on detail on
purpose, so if anything there raises a question, just reply to this email and it
comes straight to me.

I'm open to technical EM / Staff Engineer roles, and happy to get into specifics
about the work, the team, or whatever you're weighing.

— Mattie
Code Brew Consulting · codebrewconsulting.com`;
}

function deliveryHtml(name) {
  const first = escapeHtml((name || "").trim().split(/\s+/)[0] || "there");
  return `<!doctype html><html><body style="margin:0;background:#f7f0e6;padding:24px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#2c2420;line-height:1.6">
  <div style="max-width:560px;margin:0 auto;background:#fdf8f0;border:1px solid #ddd0bd;border-radius:14px;padding:32px">
    <p style="margin:0 0 16px">Hi ${first},</p>
    <p style="margin:0 0 16px">Thanks for asking — my resume is attached. I kept the site light on detail on purpose, so if anything there raises a question, just reply to this email and it comes straight to me.</p>
    <p style="margin:0 0 16px">I'm open to technical EM / Staff Engineer roles, and happy to get into specifics about the work, the team, or whatever you're weighing.</p>
    <p style="margin:24px 0 0;color:#6b5d52">— Mattie<br>
    <span style="font-size:14px">Code Brew Consulting · <a href="https://codebrewconsulting.com" style="color:#a8452b">codebrewconsulting.com</a></span></p>
  </div>
</body></html>`;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
export const handler = async (event) => {
  // Hard kill-switch — before any billable call.
  if (process.env.FEATURE_ENABLED !== "true") {
    return json(503, { error: "disabled", message: "The resume form is currently turned off." });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "bad_request", message: "Invalid request body." });
  }

  // Honeypot: real users never fill a hidden field. Pretend success, do nothing.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return json(200, { ok: true, message: "Thanks — check your inbox shortly." });
  }

  // Timing: a human takes a beat to fill a form; sub-threshold submits are bots.
  // Skipped for an explicit returning-visitor resend (a deliberate one-click action).
  if (!body.resend && Number(body.elapsedMs) < MIN_SUBMIT_MS) {
    return json(200, { ok: true, message: "Thanks — check your inbox shortly." });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const reasons = Array.isArray(body.reasons)
    ? body.reasons.filter((r) => typeof r === "string").slice(0, 10)
    : [];

  if (!name) return json(400, { error: "name_required", message: "Please add your name." });
  if (!isEmail(email))
    return json(400, { error: "email_invalid", message: "Please enter a valid email address." });

  const sourceIp = event?.requestContext?.http?.sourceIp || "unknown";

  // Per-IP rate limit (DynamoDB atomic counter with a TTL window).
  try {
    const count = await bumpRateCounter(sourceIp);
    if (count > RATE_LIMIT) {
      return json(429, {
        error: "rate_limited",
        message: "That's a few requests in a short window — try again a little later, or just email me directly.",
      });
    }
  } catch (err) {
    // Don't fail a legitimate request if the limiter has a hiccup; just log it.
    console.error("rate-limit error", err);
  }

  // Fetch the resume from private S3.
  let pdf;
  try {
    const obj = await s3.send(
      new GetObjectCommand({ Bucket: process.env.RESUME_BUCKET, Key: process.env.RESUME_KEY }),
    );
    pdf = Buffer.from(await obj.Body.transformToByteArray());
  } catch (err) {
    console.error("resume fetch failed", err);
    return json(500, { error: "delivery_failed", message: "Couldn't attach the resume just now — please email me and I'll send it straight over." });
  }

  // Deliver the resume to the requester (PDF attached + personal blurb).
  try {
    await ses.send(buildDeliveryEmail(name, email, pdf));
  } catch (err) {
    console.error("delivery email failed", err);
    return json(500, { error: "delivery_failed", message: "Couldn't send the email just now — please email me directly and I'll reply with the resume." });
  }

  // Notify the owner of the lead (best-effort — never blocks the requester's success).
  try {
    await ses.send(buildNotificationEmail({ name, email, message, reasons, sourceIp, event }));
  } catch (err) {
    console.error("notification email failed (non-fatal)", err);
  }

  return json(200, { ok: true, message: "On its way — check your inbox." });
};

// ---------------------------------------------------------------------------
// Email builders
// ---------------------------------------------------------------------------
function buildDeliveryEmail(name, toEmail, pdf) {
  const raw = buildRawWithAttachment({
    from: process.env.FROM_EMAIL,
    to: toEmail,
    replyTo: process.env.REPLY_TO,
    subject: DELIVERY_SUBJECT,
    text: deliveryText(name),
    html: deliveryHtml(name),
    attachment: {
      filename: process.env.RESUME_FILENAME || "Resume.pdf",
      contentType: "application/pdf",
      content: pdf,
    },
  });
  return new SendEmailCommand({
    FromEmailAddress: process.env.FROM_EMAIL,
    Destination: { ToAddresses: [toEmail] },
    Content: { Raw: { Data: raw } },
  });
}

function buildNotificationEmail({ name, email, message, reasons, sourceIp, event }) {
  const reasonText = reasons.length
    ? reasons.map((r) => REASON_LABELS[r] || r).join(", ")
    : "—";
  const headers = event?.headers || {};
  const userAgent = headers["user-agent"] || headers["User-Agent"] || "—";
  const referer = headers["referer"] || headers["Referer"] || "—";
  const when = new Date().toISOString();

  const text = [
    `New resume request / contact from your site.`,
    ``,
    `Name:     ${name}`,
    `Email:    ${email}`,
    `Reasons:  ${reasonText}`,
    `Message:  ${message || "—"}`,
    ``,
    `When:     ${when}`,
    `IP:       ${sourceIp}`,
    `Referer:  ${referer}`,
    `UA:       ${userAgent}`,
  ].join("\n");

  return new SendEmailCommand({
    FromEmailAddress: process.env.FROM_EMAIL,
    Destination: { ToAddresses: [process.env.NOTIFY_EMAIL] },
    ReplyToAddresses: [email], // reply goes straight to the lead
    Content: {
      Simple: {
        Subject: { Data: `New lead: ${name}${reasons.length ? ` — ${reasonText}` : ""}` },
        Body: { Text: { Data: text } },
      },
    },
  });
}

// ---------------------------------------------------------------------------
// Raw MIME with one attachment: multipart/mixed[ multipart/alternative[text,html], pdf ]
// ---------------------------------------------------------------------------
function buildRawWithAttachment({ from, to, replyTo, subject, text, html, attachment }) {
  const mixed = `mixed_${boundaryToken()}`;
  const alt = `alt_${boundaryToken()}`;
  const b64 = chunk76(attachment.content.toString("base64"));

  const lines = [
    `From: ${from}`,
    `To: ${to}`,
    replyTo ? `Reply-To: ${replyTo}` : null,
    `Subject: ${encodeHeader(subject)}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/mixed; boundary="${mixed}"`,
    ``,
    `--${mixed}`,
    `Content-Type: multipart/alternative; boundary="${alt}"`,
    ``,
    `--${alt}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    `Content-Transfer-Encoding: 8bit`,
    ``,
    text,
    ``,
    `--${alt}`,
    `Content-Type: text/html; charset="UTF-8"`,
    `Content-Transfer-Encoding: 8bit`,
    ``,
    html,
    ``,
    `--${alt}--`,
    ``,
    `--${mixed}`,
    `Content-Type: ${attachment.contentType}; name="${attachment.filename}"`,
    `Content-Transfer-Encoding: base64`,
    `Content-Disposition: attachment; filename="${attachment.filename}"`,
    ``,
    b64,
    ``,
    `--${mixed}--`,
    ``,
  ].filter((l) => l !== null);

  return Buffer.from(lines.join("\r\n"), "utf-8");
}

// ---------------------------------------------------------------------------
// Per-IP rate limiter: atomic counter keyed by IP, auto-expiring via TTL.
// ---------------------------------------------------------------------------
async function bumpRateCounter(ip) {
  const now = Math.floor(Date.now() / 1000);
  const res = await ddb.send(
    new UpdateItemCommand({
      TableName: process.env.RATE_TABLE,
      Key: { pk: { S: `ip#${ip}` } },
      UpdateExpression: "ADD #c :one SET #ttl = if_not_exists(#ttl, :exp)",
      ExpressionAttributeNames: { "#c": "count", "#ttl": "ttl" },
      ExpressionAttributeValues: {
        ":one": { N: "1" },
        ":exp": { N: String(now + RATE_WINDOW_SEC) },
      },
      ReturnValues: "UPDATED_NEW",
    }),
  );
  return Number(res.Attributes?.count?.N || "1");
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function json(statusCode, payload) {
  // CORS headers are added by the HTTP API; keep the body to the contract.
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  };
}

function isEmail(s) {
  return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]),
  );
}

function encodeHeader(s) {
  // RFC 2047 encode only if non-ASCII is present.
  return /[^\x00-\x7F]/.test(s)
    ? `=?UTF-8?B?${Buffer.from(s, "utf-8").toString("base64")}?=`
    : s;
}

function boundaryToken() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function chunk76(b64) {
  return b64.replace(/.{1,76}/g, "$&\r\n").trimEnd();
}
