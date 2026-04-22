/**
 * Telegram Bot API helpers (plain fetch — no third-party wrapper).
 */

export type TelegramSendMessageParams = {
  chatId: string;
  text: string;
  parseMode?: "HTML" | "Markdown" | "MarkdownV2";
};

export async function sendTelegramMessage(
  botToken: string,
  params: TelegramSendMessageParams,
): Promise<Response> {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const body: Record<string, string | boolean> = {
    chat_id: params.chatId,
    text: params.text,
  };
  if (params.parseMode) {
    body.parse_mode = params.parseMode;
  }

  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
