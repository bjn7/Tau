import {
  writeTextFile,
  readTextFile,
  exists,
  BaseDirectory,
} from "@tauri-apps/plugin-fs";

export type Algorithm = "sha1" | "sha256" | "sha512";

export type SecretEntry = {
  issuer: string;
  secret: string;
  type: "totp" | "hotp";
  email: string;
  label: string;
  period: number;
  algorithm: Algorithm;
  digits: number;
};

// export type GroupedSecretEntries = {
//   [algorithm in Algorithm]: {
//     [counter: number]: {
//       [digits: number]: {
//         issuer: string;
//         secret: string;
//         email: string;
//         label: string;
//       };
//     };
//   };
// };

const FILE_NAME = "tau_secrets_do_not_delete_v5.txt";

async function readSecrets(): Promise<SecretEntry[]> {
  const fileExists = await exists(FILE_NAME, {
    baseDir: BaseDirectory.AppLocalData,
  });

  if (!fileExists) {
    await writeTextFile(FILE_NAME, "[]", {
      baseDir: BaseDirectory.AppLocalData,
    });
  }
  const fileData = await readTextFile(FILE_NAME, {
    baseDir: BaseDirectory.AppLocalData,
  });
  return JSON.parse(fileData);
}

async function writeSecrets(data: SecretEntry[]): Promise<void> {
  await writeTextFile(FILE_NAME, JSON.stringify(data), {
    baseDir: BaseDirectory.AppLocalData,
  });
}

export { readSecrets, writeSecrets };
