import * as MailComposer from "expo-mail-composer";
import { createFullBackup } from "./createFullBackup";

export async function sendBackupEmail() {
  const { jsonPath, pdfPath } = await createFullBackup();

  await MailComposer.composeAsync({
    recipients: ["yourbusiness@email.com"],
    subject: "Restaurant Orders Backup",
    body: "Attached PDF (readable) and JSON (data backup).",
    attachments: [pdfPath, jsonPath],
  });
}
