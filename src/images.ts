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

// Helper function to save the canvas section as an image for debugging or pairing with percentages
const saveCanvasAsImage = (canvas: any, filename: string) => {
  const out = fs.createWriteStream(path.join("./debug", filename));
  const stream = canvas.createPNGStream();
  stream.pipe(out);
};

// Initialize the Tesseract worker once
const initializeTesseractWorker = async () => {
  const worker = await createWorker();
  await worker.setParameters({
    tessedit_char_whitelist: "0123456789+-%",
    tessedit_pageseg_mode: Tesseract.PSM.SINGLE_LINE,
  });
  return worker;
};

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
  saveCanvasAsImage(canvas, `row-${rowIndex}-col-${colIndex}-text.png`);

  // Convert the canvas to a Buffer for Tesseract
  const buffer = canvas.toBuffer("image/png");

  // Use the worker to recognize the text from the image
  const {
    data: { text },
  } = await tesseractWorker.recognize(buffer);

  return text.trim();
};

// Helper function to get average color from a section of the image and save the cropped image
const getAverageColor = (
  image: any,
  x: number,
  y: number,
  width: number,
  height: number,
  rowIndex: number,
  colIndex: number,
): RGB => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Crop the image properly by specifying the source region
  ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

  // Save the cropped image with its color for debugging or pairing with percentages
  saveCanvasAsImage(canvas, `row-${rowIndex}-col-${colIndex}-color.png`);

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
};

// Main function to process the image and extract the table data
async function processImage(imagePath: string) {
  const image = await loadImage(imagePath);

  const rows: PercentageColorRow[] = [];
  const rowHeight = 86;
  const numRows = 14;

  // Ensure the debug directory exists
  if (!fs.existsSync("./debug")) {
    fs.mkdirSync("./debug");
  }

  // Array to hold all promises
  const percentagePromises = [];
  const table: {
    firstPercentage: string;
    firstColor: string;
    secondPercentage: string;
    secondColor: string;
  }[] = [];

  for (let i = 0; i < numRows; i++) {
    const percentage1Promise = extractTextFromImage(
      image,
      0, // source x
      i * rowHeight, // source y (starting point for this row)
      115, // width of the cropped area
      60, // height of the cropped area
      i,
      1,
    );
    const percentage2Promise = extractTextFromImage(
      image,
      115, // source x
      i * rowHeight, // source y (same row)
      120, // width of the cropped area
      60, // height of the cropped area
      i,
      2,
    );

    percentagePromises.push(
      Promise.all([percentage1Promise, percentage2Promise]).then(
        async ([percentage1, percentage2]) => {
          // Clean up the extracted percentages
          const cleanPercentage = (percentage: string) => {
            const match = percentage.match(/[+-]?\d+%/);
            return match ? match[0] : percentage;
          };

          percentage1 = cleanPercentage(percentage1);
          percentage2 = cleanPercentage(percentage2);

          const y = 15 + i * rowHeight;

          // Extract the colors and save their respective images
          const color1 = getAverageColor(image, 240, y, 30, 30, i, 1); // First column color
          const color2 = getAverageColor(image, 270, y, 30, 30, i, 2); // Second column color

          // Add the data to the table
          table.push({
            firstPercentage: percentage1,
            firstColor: `rgb(${color1[0]}, ${color1[1]}, ${color1[2]})`,
            secondPercentage: percentage2,
            secondColor: `rgb(${color2[0]}, ${color2[1]}, ${color2[2]})`,
          });
        },
      ),
    );
  }

  // Wait for all Tesseract calls to complete
  await Promise.all(percentagePromises);

  // Convert percentage strings to numbers for sorting
  const percentageToNumber = (percentage: string): number => {
    return parseInt(percentage.replace("%", ""), 10);
  };

  // Sort based on both percentages independently
  const sortedTable = table.sort((a, b) => {
    // Sort firstPercentage in descending order
    const firstPercentageComparison =
      percentageToNumber(b.firstPercentage) -
      percentageToNumber(a.firstPercentage);
    if (firstPercentageComparison !== 0) return firstPercentageComparison;

    // Sort secondPercentage in descending order
    return (
      percentageToNumber(b.secondPercentage) -
      percentageToNumber(a.secondPercentage)
    );
  });

  // Output the sorted table
  console.table(sortedTable);
}

// Run the function with your image path
await processImage("./images/colours.png");
