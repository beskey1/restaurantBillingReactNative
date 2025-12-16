// import * as Print from "expo-print";
// import { buildOrdersHTML } from "./buildOrdersHTML";

// export async function createPDFBackup(data: any) {
//   const html = buildOrdersHTML(data);

//   const { uri } = await Print.printToFileAsync({
//     html,
//     base64: false,
//   });

//   return uri;
// }



import * as Print from "expo-print";
import { Platform } from "react-native";
import { buildOrdersHTML } from "./buildOrdersHTML";

export async function createPDFBackup(data: any) {
  if (Platform.OS === "web") {
    throw new Error("PDF backup not supported on web");
  }

  const html = buildOrdersHTML(data);

  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  return uri;
}
