import { buildBackupJSON } from "./buildBackupJSON";
import { createJSONBackup } from "./createJSONBackup";
import { createPDFBackup } from "./createPDFBackup";

export async function createFullBackup() {
  const data = buildBackupJSON();

  const [jsonPath, pdfPath] = await Promise.all([
    createJSONBackup(data),
    createPDFBackup(data),
  ]);

  return { jsonPath, pdfPath };
}
