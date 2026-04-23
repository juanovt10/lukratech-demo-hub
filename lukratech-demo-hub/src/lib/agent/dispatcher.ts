import type { AgentRunResult } from "@/lib/agent/types";
import { sendRunSummaryEmail } from "@/lib/integrations/resend";
import { sendTelegramMessage } from "@/lib/integrations/telegram";

export type DispatchResult = {
  telegramSent: number;
  emailSent: boolean;
  errors: string[];
};

/**
 * Dispatch outbound notifications for a completed run. Does not throw; errors
 * are collected in `errors`.
 */
export async function dispatchAgentActions(
  result: AgentRunResult,
): Promise<DispatchResult> {
  const errors: string[] = [];
  let telegramSent = 0;

  for (const action of result.actions) {
    if (action.actionType === "telegram") {
      try {
        await sendTelegramMessage(action.messageSent);
        telegramSent += 1;
      } catch (err: unknown) {
        errors.push(
          err instanceof Error
            ? err.message
            : "Telegram send failed with unknown error",
        );
      }
    }
  }

  let emailSent = false;
  if (result.actionsTaken > 0) {
    try {
      await sendRunSummaryEmail(result);
      emailSent = true;
    } catch (err: unknown) {
      errors.push(
        err instanceof Error
          ? err.message
          : "Resend email failed with unknown error",
      );
    }
  }

  return { telegramSent, emailSent, errors };
}
