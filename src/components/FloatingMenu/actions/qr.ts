import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

import { SecretEntry } from "../../../libs/FS";
import cacheImage from "../../../libs/fetchAndCacheIcon";
import parseAndInsert from "../../../libs/parseAndInsert";

const appWindow = getCurrentWebviewWindow();

export default async function (
  updateState: React.Dispatch<React.SetStateAction<SecretEntry[]>>
) {
  await appWindow.hide();
  await new Promise((r) => setTimeout(r, 1000)); //waiting for animation to complete
  const screenshot: string | null = await invoke("screenshot");
  await appWindow.show();
  if (!screenshot) return toast.error("QrCode not detected.");
  if (!URL.canParse(screenshot)) return toast.error("Malformed qrcode.");
  const urlString = new URL(screenshot);
  if (urlString.protocol != "otpauth:") return toast.error("Malformed qrcode.");
  if (urlString.pathname.includes("hotp"))
    return toast.error("HOTP is not supported yet!");
  const id = toast.loading("Caching Images...");
  console.log(urlString);
  await cacheImage(urlString.searchParams.get("issuer") || "");
  parseAndInsert(urlString, updateState);
  toast.success("imported!", {
    id,
  });
}
