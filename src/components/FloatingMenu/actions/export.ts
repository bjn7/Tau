import { toast } from "sonner";
import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";

import { SecretEntry } from "../../../libs/FS";

//@ts-ignore
import { authenticator } from "@otplib/preset-browser";

export default async function (state: SecretEntry[]) {
  const selectedPath = await save({
    title: "Open",
    defaultPath: "OTPBACKUP.txt",
    filters: [
      {
        name: "Text File",
        extensions: ["txt"],
      },
    ],
  });
  if (!selectedPath) return;
  const contents: string[] = [];
  state.forEach((entry) => {
    const otpUrl = new URL(
      authenticator.keyuri(entry.email, entry.issuer, entry.secret)
    );
    otpUrl.searchParams.set("period", entry.period.toString());
    otpUrl.searchParams.set("algorithm", entry.algorithm.toUpperCase());
    otpUrl.searchParams.set("digits", entry.digits.toString());
    contents.push(otpUrl.toString());
  });
  await writeTextFile(selectedPath, contents.join("\n"))
    .then(() => {
      toast.success("exported!");
    })
    .catch(() => {
      toast.success("Failed to export.");
    });
}
