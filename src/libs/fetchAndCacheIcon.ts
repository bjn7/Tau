import { BaseDirectory, writeFile, exists } from "@tauri-apps/plugin-fs";

type FetchResponse = {
  icon: string;
  name: string;
  domain: string;
  claimed: boolean;
  brandId: string;
};

export default async function (issuer: string): Promise<boolean> {
  const filePath = `${issuer}.webp`;
  // Check if the image is already cached
  if (await exists(filePath, { baseDir: BaseDirectory.AppCache })) {
    return true;
  }

  // Fetch data from the API
  const response = await fetch(`https://api.brandfetch.io/v2/search/${issuer}`);
  if (!response.ok) return false;

  const responseData: FetchResponse[] = await response.json();
  if (responseData.length < 1 || !responseData[0].icon) return false;

  return cacheImage(issuer.toLowerCase(), responseData[0].domain);
}

async function cacheImage(issuer: string, domain: string): Promise<boolean> {
  let iconType = "symbol";
  let iconTheme = "light";

  const logoDomains = ["apple.com", "stake.com", "roblox.com"];
  const iconDomains = ["heroku.com"];
  const darkThemeDomains = ["discord.com", "stake.com"];

  if (logoDomains.includes(domain)) {
    iconType = "logo";
  } else if (iconDomains.includes(domain)) {
    iconType = "icon";
  } else if (darkThemeDomains.includes(domain)) {
    iconTheme = "dark";
  }

  const imageUrl = `https://cdn.brandfetch.io/${domain}/${iconType}/theme/${iconTheme}/fallback/transparent/h/64/w/64/`;

  console.log(imageUrl);

  try {
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) return false;
    const imageBuffer = await imageResponse.arrayBuffer();
    await writeFile(`${issuer}.webp`, new Uint8Array(imageBuffer), {
      baseDir: BaseDirectory.AppCache,
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
