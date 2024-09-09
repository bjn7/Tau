import { useState, useEffect } from "react";

import { appCacheDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/core";
import { exists, BaseDirectory } from "@tauri-apps/plugin-fs";

import useEffectOnce from "../../hooks/useEffectOnce";

export default function ({ issuer }: { issuer: string }) {
  const [imagePath, setImagePath] = useState<string>("src/assets/tau.svg");

  async function updatePaths() {
    const imgExits = await exists(issuer + ".webp", {
      baseDir: BaseDirectory.AppCache,
    });
    if (imgExits) {
      setImagePath(
        convertFileSrc(await join(await appCacheDir(), issuer + ".webp"))
      );
    }
  }
  useEffectOnce(() => {
    updatePaths();
  }, []);

  // const imgRef = useRef<HTMLImageElement | null>(null);

  const getDominantColor = (img: HTMLImageElement) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      const colorMap: { [key: string]: number } = {};

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];
        if (a === 0) continue;
        const color = `rgba(${r},${g},${b},${0.1})`;
        if (!colorMap[color]) {
          colorMap[color] = 0;
        }
        colorMap[color]++;
      }

      const colors = Object.keys(colorMap).sort(
        (a, b) => colorMap[b] - colorMap[a]
      );
      let dominantColor = null;
      if (colors.length > 0) {
        dominantColor = colors[0];
      }
      return dominantColor;
    }
    return null;
  };

  const [dominantColor, setdominantColor] = useState<string | null>(null);
  useEffect(() => {
    // const image = imgRef.current;

    // if (image) {
    //   if (image.complete) {
    //     setdominantColor(getDominantColor(image));
    //     console.log(getDominantColor(image));
    //   } else {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imagePath;
    image.onload = () => {
      setdominantColor(getDominantColor(image));
    };
    // }
    // };
  }, [imagePath]);

  return (
    <div
      className={`p-2 rounded-xl size-16 relative bg-[rgb(20,20,20)] flex items-center`}
      style={{ backgroundColor: dominantColor || undefined }}
    >
      <img
        src={dominantColor ? imagePath : "src/assets/tau.svg"}
        // ref={imgRef}
        crossOrigin="anonymous"
      />
    </div>
  );
}
