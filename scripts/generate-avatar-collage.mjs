import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = new URL("../public", import.meta.url).pathname;
const avatarsDir = join(outDir, "avatars");
mkdirSync(avatarsDir, { recursive: true });

const skin = ["#6f4635", "#8b5a43", "#a56f52", "#c08666", "#d7a17e", "#e5bb99", "#f0cdb1", "#7d5647", "#b77a61", "#5f3d34"];
const hair = ["#171313", "#2b1b17", "#44261d", "#6e3f28", "#111827", "#7a533d", "#d7b07c", "#3f2a20", "#221a17", "#915c38"];
const tops = ["#ff2d67", "#9b5de5", "#00bbf9", "#00a676", "#f4a261", "#ef476f", "#2b2d42", "#118ab2", "#7b2cbf", "#f77f00"];
const bg = ["#fce7ef", "#e9f5ff", "#fff2d7", "#e9f8ef", "#f1ecff", "#ffe9df", "#e9f0ff", "#f8f1e8", "#e5fbf5", "#f6e8ff"];

function pick(list, index, offset = 0) {
  return list[(index * 7 + offset * 11) % list.length];
}

function faceMarkup(index, size = 64) {
  const tone = pick(skin, index, 1);
  const hairColor = pick(hair, index, 2);
  const top = pick(tops, index, 3);
  const back = pick(bg, index, 4);
  const eyeY = 29 + (index % 3);
  const smile = index % 4;
  const hairStyle = index % 6;
  const accessory = index % 9;
  const leftEye = 24 + (index % 2);
  const rightEye = 39 - (index % 2);
  const mouth = smile === 0 ? "M26 43 Q32 48 39 43" : smile === 1 ? "M27 43 Q32 45 38 43" : smile === 2 ? "M28 43 L38 43" : "M28 42 Q32 46 37 42";

  const hairShape = [
    `<path d="M17 28c0-13 9-22 22-18 8 2 12 9 10 19-7-9-19-12-32-1Z" fill="${hairColor}"/>`,
    `<path d="M16 35c-4-17 7-29 21-26 12 3 17 16 9 31-5-14-17-20-30-5Z" fill="${hairColor}"/>`,
    `<path d="M18 24c3-12 19-19 29-7 5 6 3 13 0 20-8-13-19-16-29-13Z" fill="${hairColor}"/>`,
    `<path d="M14 34c0-16 9-25 22-25 11 0 18 8 17 22-9-8-23-9-39 3Z" fill="${hairColor}"/>`,
    `<path d="M19 21c5-10 22-10 27 0 2 4 2 8 1 13-8-6-19-8-30-3 0-4 0-7 2-10Z" fill="${hairColor}"/>`,
    `<path d="M15 31c1-15 9-24 23-23 14 1 17 15 13 28-8-11-22-15-36-5Z" fill="${hairColor}"/>`,
  ][hairStyle];

  const accessoryShape = accessory === 0
    ? `<circle cx="45" cy="34" r="2.4" fill="#f7d046"/><circle cx="19" cy="34" r="2.4" fill="#f7d046"/>`
    : accessory === 1
      ? `<path d="M22 18h20" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".82"/>`
      : accessory === 2
        ? `<circle cx="22" cy="29" r="5" fill="none" stroke="#1f2937" stroke-width="1.6"/><circle cx="42" cy="29" r="5" fill="none" stroke="#1f2937" stroke-width="1.6"/><path d="M27 29h10" stroke="#1f2937" stroke-width="1.5"/>`
        : "";

  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
    <rect width="64" height="64" rx="32" fill="${back}"/>
    <path d="M15 65c2-13 10-20 17-20s15 7 17 20H15Z" fill="${top}"/>
    <circle cx="32" cy="31" r="18" fill="${tone}"/>
    ${hairShape}
    <circle cx="${leftEye}" cy="${eyeY}" r="2" fill="#171717"/>
    <circle cx="${rightEye}" cy="${eyeY}" r="2" fill="#171717"/>
    <path d="${mouth}" fill="none" stroke="#5a2928" stroke-width="2" stroke-linecap="round"/>
    <circle cx="22" cy="36" r="2.6" fill="#ef8ca8" opacity=".32"/>
    <circle cx="42" cy="36" r="2.6" fill="#ef8ca8" opacity=".32"/>
    ${accessoryShape}
  </svg>`;
}

const cells = [];
for (let i = 0; i < 100; i += 1) {
  const fileName = `face-${String(i).padStart(2, "0")}.svg`;
  const avatar = faceMarkup(i);
  writeFileSync(join(avatarsDir, fileName), avatar.trim());
  const x = (i % 10) * 64;
  const y = Math.floor(i / 10) * 64;
  cells.push(`<g transform="translate(${x} ${y})">${avatar.replace(/<svg[^>]*>|<\/svg>/g, "")}</g>`);
}

const collage = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="640" height="640">
  <rect width="640" height="640" fill="#fff"/>
  ${cells.join("\n  ")}
</svg>`;

writeFileSync(join(outDir, "images", "avatar-collage.svg"), collage);
