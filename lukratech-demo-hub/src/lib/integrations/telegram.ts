/**
 * Telegram Bot API (plain fetch — no third-party wrapper).
 * Env is read at call time.
 */

function readEnv(name: "TELEGRAM_BOT_TOKEN" | "TELEGRAM_CHAT_ID"): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function isTelegramResponse(value: unknown): value is {
  ok: boolean;
  description?: string;
} {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return "ok" in value && typeof (value as { ok: unknown }).ok === "boolean";
}

/**
 * Send a message to the configured chat. Text should be plain; it is sent with
 * parse_mode HTML (escape any &lt; &gt; &amp; if you include user content).
 */
export async function sendTelegramMessage(message: string): Promise<void> {
  const token = readEnv("TELEGRAM_BOT_TOKEN");
  const chatId = readEnv("TELEGRAM_CHAT_ID");
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
    }),
  });

  let body: unknown;
  try {
    body = (await response.json()) as unknown;
  } catch {
    throw new Error(
      `Telegram sendMessage failed: HTTP ${response.status} (non-JSON body)`,
    );
  }

  if (!response.ok) {
    const desc =
      isTelegramResponse(body) && typeof body.description === "string"
        ? body.description
        : "Unknown error";
    throw new Error(
      `Telegram sendMessage failed: HTTP ${response.status} — ${desc}`,
    );
  }

  if (isTelegramResponse(body) && body.ok === false) {
    const desc =
      typeof body.description === "string" ? body.description : "ok is false";
    throw new Error(`Telegram sendMessage failed: ${desc}`);
  }
}
