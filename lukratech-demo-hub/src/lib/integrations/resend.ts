import { Resend } from "resend";

export function getResendClient(apiKey: string | undefined): Resend | null {
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
}
