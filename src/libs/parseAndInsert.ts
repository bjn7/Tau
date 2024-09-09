import { Algorithm, SecretEntry, writeSecrets } from "./FS";

export default function (
  urlString: URL,
  updateState: React.Dispatch<React.SetStateAction<SecretEntry[]>>
) {
  var label = decodeURIComponent(urlString.pathname).split("/").pop();
  const parsed = {
    issuer: urlString.searchParams.get("issuer") || "",
    secret: urlString.searchParams.get("secret") || "",
    type: urlString.host as "totp" | "hotp",
    email: label?.split(":")[1] || "",
    label: label?.split(":")[0] || "",
    period: parseInt(urlString.searchParams.get("period") || "30"),
    digits: parseInt(urlString.searchParams.get("digits") || "6"),
    algorithm: (
      urlString.searchParams.get("algorithm") || "sha1"
    ).toLocaleLowerCase() as Algorithm,
  };
  if (parsed.type == "hotp") return; //not yet supported
  updateState((pre) => {
    writeSecrets([...pre, parsed]);
    return [...pre, parsed];
  });
}
