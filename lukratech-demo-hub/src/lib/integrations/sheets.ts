/**
 * Google Sheets integration placeholder.
 * Uses service account credentials from environment variables at runtime.
 */

export type SheetsCredentials = {
  clientEmail: string;
  privateKey: string;
  spreadsheetId: string;
};

export function getSheetsCredentialsFromEnv(): SheetsCredentials | null {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    return null;
  }

  return { clientEmail, privateKey, spreadsheetId };
}
