import { toast } from "sonner";
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";

import { SecretEntry } from "../../../libs/FS";
import cacheImage from "../../../libs/fetchAndCacheIcon";
import paseAndInsert from "../../../libs/parseAndInsert";

export default async function (
  updateState: React.Dispatch<React.SetStateAction<SecretEntry[]>>
) {
  const selectedPath = await open({ title: "Open", multiple: false });
  if (!selectedPath) return;
  const id = toast.loading("importing...");
  const contents = await readTextFile(selectedPath as string);
  for (const e of contents.split("\n")) {
    if (!e.startsWith("otpauth://")) continue;
    if (!URL.canParse(e)) continue;
    const urlString = new URL(e);
    console.log(urlString.searchParams.get("issuer"));
    cacheImage(urlString.searchParams.get("issuer") || "").then(() => {
      paseAndInsert(urlString, updateState);
    });
  }
  toast.success("imported!", {
    id: id,
  });
}
