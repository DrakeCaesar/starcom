import { createCanvas } from "canvas";
import * as fs from "fs";
import * as path from "path";
import Tesseract, { createWorker } from "tesseract.js";

let tesseractWorker: any = null;

// Initialize the Tesseract worker once
export async function initializeTesseractWorker() {
  const worker = await createWorker();
  await worker.setParameters({
    tessedit_char_whitelist: "0123456789+-% /.",
    tessedit_pageseg_mode: Tesseract.PSM.SINGLE_LINE,
  });
  return worker;
}

export async function extractTextFromImage(
  image: any,
  x: number,
  y: number,
  width: number,
  height: number,
  rowIndex: number,
  colIndex: number,
): Promise<string> {
  // Initialize the Tesseract worker if it hasn't been initialized yet
  if (!tesseractWorker) {
    tesseractWorker = await initializeTesseractWorker();
  }

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
  await saveCanvasAsImage(canvas, `row-${rowIndex}-col-${colIndex}-text.png`);

  const buffer = canvas.toBuffer("image/png");
  const {
    data: { text },
  } = await tesseractWorker.recognize(buffer);

  return text.trim();
}

export async function saveCanvasAsImage(
  canvas: any,
  filename: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const out = fs.createWriteStream(path.join("./debug", filename));
    const stream = canvas.createPNGStream();

    stream.pipe(out);

    out.on("finish", resolve);
    out.on("error", reject);
  });
}

type RGB = [number, number, number];
export async function getAverageColor(
  image: any,
  x: number,
  y: number,
  width: number,
  height: number,
  rowIndex: number,
  colIndex: number,
): Promise<RGB> {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Crop the image properly by specifying the source region
  ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

  // Save the cropped image with its color for debugging or pairing with percentages
  await saveCanvasAsImage(canvas, `row-${rowIndex}-col-${colIndex}-color.png`);

  const imageData = ctx.getImageData(0, 0, width, height).data;
  let r = 0,
    g = 0,
    b = 0;
  const totalPixels = width * height;

  for (let i = 0; i < imageData.length; i += 4) {
    r += imageData[i];
    g += imageData[i + 1];
    b += imageData[i + 2];
  }

  return [
    Math.floor(r / totalPixels),
    Math.floor(g / totalPixels),
    Math.floor(b / totalPixels),
  ];
}

export function percentageToNumber(percentage: string): number {
  return parseInt(percentage.replace("%", ""), 10);
}

export async function handleColorExtractionAndAddToTable(
  image: any,
  rowIndex: number,
  rowHeight: number,
  percentage1: string,
  percentage2: string,
  table: {
    firstPercentage: string;
    firstColor: string;
    secondPercentage: string;
    secondColor: string;
  }[],
) {
  const y = 15 + rowIndex * rowHeight;

  const color1 = await getAverageColor(image, 240, y, 30, 30, rowIndex, 1);
  const color2 = await getAverageColor(image, 270, y, 30, 30, rowIndex, 2);

  table.push({
    firstPercentage: percentage1,
    firstColor: `rgb(${color1[0]}, ${color1[1]}, ${color1[2]})`,
    secondPercentage: percentage2,
    secondColor: `rgb(${color2[0]}, ${color2[1]}, ${color2[2]})`,
  });
}

export async function addToTable(
  count1: string,
  count2: string,
  price: string,
  perc: string,
  table: {
    sellProc: string;
    buyProc: string;
    sellPrice: string;
    buyPrice: string;
  }[],
) {
  table.push({
    sellProc: count1,
    buyProc: count2,
    sellPrice: price,
    buyPrice: perc,
  });
}

export function ensureDebugDirectoryExists() {
  if (!fs.existsSync("./debug")) {
    fs.mkdirSync("./debug");
  }
}

export function cleanPercentage(percentage: string): string {
  const match = percentage.match(/[+-]?\d+%/);
  return match ? match[0] : percentage;
}

export function sortTableByPercentages(
  table: {
    firstPercentage: string;
    firstColor: string;
    secondPercentage: string;
    secondColor: string;
  }[],
) {
  return table.sort((a, b) => {
    const firstPercentageComparison =
      percentageToNumber(b.firstPercentage) -
      percentageToNumber(a.firstPercentage);
    if (firstPercentageComparison !== 0) return firstPercentageComparison;

    return (
      percentageToNumber(b.secondPercentage) -
      percentageToNumber(a.secondPercentage)
    );
  });
}
