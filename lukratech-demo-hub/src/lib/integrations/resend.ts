import { Resend } from "resend";
import type { AgentRunResult } from "@/lib/agent/types";

function readEnv(name: "RESEND_API_KEY" | "RESEND_ALERT_EMAIL"): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Email summary of a completed agent run. Env is read at call time.
 * Sends only when there was at least one action (result.actionsTaken &gt; 0).
 */
export async function sendRunSummaryEmail(
  result: AgentRunResult,
): Promise<void> {
  if (result.actionsTaken <= 0) {
    return;
  }

  const apiKey = readEnv("RESEND_API_KEY");
  const to = readEnv("RESEND_ALERT_EMAIL");
  const resend = new Resend(apiKey);

  const ranAt = new Date().toISOString();
  const dateLabel = new Date().toLocaleDateString("es-CO");
  const subject = `[${result.industry.toUpperCase()}] Ops Agent — ${
    result.actionsTaken
  } alertas | ${dateLabel}`;

  const actionRows = result.actions
    .map(
      (a) =>
        `<tr><td>${escapeHtml(a.targetId)}</td><td>${escapeHtml(
          a.urgency,
        )}</td><td>${escapeHtml(a.messageSent)}</td></tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html>
  <head><meta charset="utf-8" /></head>
  <body>
    <h1>Resumen Ops Agent</h1>
    <p><strong>Industria:</strong> ${escapeHtml(result.industry)}</p>
    <p><strong>Timestamp (ISO):</strong> ${escapeHtml(ranAt)}</p>
    <p><strong>Ítems revisados:</strong> ${result.itemsReviewed}</p>
    <p><strong>Acciones tomadas:</strong> ${result.actionsTaken}</p>
    <h2>Acciones</h2>
    <table border="1" cellpadding="6" cellspacing="0">
      <thead>
        <tr><th>ID</th><th>Urgencia</th><th>Mensaje</th></tr>
      </thead>
      <tbody>
        ${actionRows}
      </tbody>
    </table>
    <h2>Razonamiento</h2>
    <p>${escapeHtml(result.reasoningSummary)}</p>
  </body>
</html>`;

  const response = await resend.emails.send({
    from: "LukraTech Ops Agent <alerts@lukratech.com>",
    to: [to],
    subject,
    html,
  });

  if (response.error !== null) {
    const err = response.error;
    throw new Error(`Resend error: ${err.message} (${err.name})`);
  }
}
