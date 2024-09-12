import { createCanvas, loadImage } from "canvas";
import * as fs from "fs";
import * as path from "path";
import Tesseract, { createWorker } from "tesseract.js";

type RGB = [number, number, number];
type PercentageColorRow = {
  percentage1: string;
  percentage2: string;
  color1: RGB;
  color2: RGB;
};

async function saveCanvasAsImage(canvas: any, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const out = fs.createWriteStream(path.join("./debug", filename));
    const stream = canvas.createPNGStream();

    stream.pipe(out);

    out.on("finish", resolve);
    out.on("error", reject);
  });
}

// Initialize the Tesseract worker once
async function initializeTesseractWorker() {
  const worker = await createWorker();
  await worker.setParameters({
    tessedit_char_whitelist: "0123456789+-%",
    tessedit_pageseg_mode: Tesseract.PSM.SINGLE_LINE,
  });
  return worker;
}

// Save this worker to reuse across function calls
let tesseractWorker: any = null;

const extractTextFromImage = async (
  image: any,
  x: number,
  y: number,
  width: number,
  height: number,
  rowIndex: number,
  colIndex: number,
): Promise<string> => {
  // Initialize the Tesseract worker if it hasn't been initialized yet
  if (!tesseractWorker) {
    tesseractWorker = await initializeTesseractWorker();
  }

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Crop the image properly by specifying the source region
  ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

  // Save the cropped image for debugging (optional)
  await saveCanvasAsImage(canvas, `row-${rowIndex}-col-${colIndex}-text.png`);

  // Convert the canvas to a Buffer for Tesseract
  const buffer = canvas.toBuffer("image/png");

  // Use the worker to recognize the text from the image
  const {
    data: { text },
  } = await tesseractWorker.recognize(buffer);

  return text.trim();
};

// Helper function to get average color from a section of the image and save the cropped image
async function getAverageColor(
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

async function processImage(imagePath: string) {
  const image = await loadImage(imagePath);

  const rows: PercentageColorRow[] = [];
  const rowHeight = 86;
  const numRows = 14;

  ensureDebugDirectoryExists();

  const percentagePromises = [];
  const table: {
    firstPercentage: string;
    firstColor: string;
    secondPercentage: string;
    secondColor: string;
  }[] = [];

  for (let i = 0; i < numRows; i++) {
    percentagePromises.push(handleRow(image, i, rowHeight, table));
  }

  await Promise.all(percentagePromises);

  const sortedTable = sortTableByPercentages(table);
  console.table(sortedTable);
}

function ensureDebugDirectoryExists() {
  if (!fs.existsSync("./debug")) {
    fs.mkdirSync("./debug");
  }
}

function cleanPercentage(percentage: string): string {
  const match = percentage.match(/[+-]?\d+%/);
  return match ? match[0] : percentage;
}

async function handleRow(
  image: any,
  rowIndex: number,
  rowHeight: number,
  table: {
    firstPercentage: string;
    firstColor: string;
    secondPercentage: string;
    secondColor: string;
  }[],
) {
  const percentage1Promise = extractTextFromImage(
    image,
    0,
    rowIndex * rowHeight,
    115,
    60,
    rowIndex,
    1,
  );
  const percentage2Promise = extractTextFromImage(
    image,
    115,
    rowIndex * rowHeight,
    120,
    60,
    rowIndex,
    2,
  );

  const [percentage1, percentage2] = await Promise.all([
    percentage1Promise,
    percentage2Promise,
  ]);

  await handleColorExtractionAndAddToTable(
    image,
    rowIndex,
    rowHeight,
    cleanPercentage(percentage1),
    cleanPercentage(percentage2),
    table,
  );
}

async function handleColorExtractionAndAddToTable(
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

function percentageToNumber(percentage: string): number {
  return parseInt(percentage.replace("%", ""), 10);
}

function sortTableByPercentages(
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

// Run the function with your image path
await processImage("./images/colours.png");
process.exit(0);
