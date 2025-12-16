// import * as FileSystem from "expo-file-system";

// export async function createJSONBackup(data: any) {
//   const dir = (FileSystem as any).documentDirectory as string | null;

//   if (!dir) {
//     throw new Error("Document directory not available");
//   }

//   const path = `${dir}orders-backup-${Date.now()}.json`;

//   await FileSystem.writeAsStringAsync(
//     path,
//     JSON.stringify(data, null, 2)
//   );

//   return path;
// }


import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

export async function createJSONBackup(data: any) {
  // ❌ Web does not support local file system
  if (Platform.OS === "web") {
    throw new Error("Backup not supported on web");
  }

  const dir = (FileSystem as any).documentDirectory as string | null;

  if (!dir) {
    throw new Error("Document directory not available");
  }

  const path = `${dir}orders-backup-${Date.now()}.json`;

  await FileSystem.writeAsStringAsync(
    path,
    JSON.stringify(data, null, 2)
  );

  return path;
}
