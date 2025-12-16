import { clearOrders } from "../_db/database";
import { sendBackupEmail } from "./sendBackupEmail";

export async function backupAndResetOrders() {
  await sendBackupEmail();
  clearOrders();
}
