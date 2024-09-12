import { createCanvas, loadImage } from "canvas";
import * as fs from "fs";
import * as path from "path";
import Tesseract from "tesseract.js";

type RGB = [number, number, number];
type PercentageColorRow = {
  percentage1: string;
  percentage2: string;
  color1: RGB;
  color2: RGB;
};

// Helper function to save the canvas section as an image for debugging
const saveCanvasAsImage = (canvas: any, filename: string) => {
  const out = fs.createWriteStream(path.join("./debug", filename));
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  // out.on("finish", () => console.log(`Saved ${filename}`));
};

// Helper function to extract percentage text
const extractTextFromImage = async (
  image: any,
  x: number,
  y: number,
  width: number,
  height: number,
  rowIndex: number,
  colIndex: number,
): Promise<string> => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Crop the image properly by specifying the source region
  ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

  // Save the cropped image for debugging
  saveCanvasAsImage(canvas, `row-${rowIndex}-col-${colIndex}-text.png`);

  // Convert the canvas to a Buffer for Tesseract
  const buffer = canvas.toBuffer("image/png");

  const result = await Tesseract.recognize(buffer, "eng", {
    // logger: (m) => console.log(m),
  });

  return result.data.text.trim();
};

// Helper function to get average color from a section of the image
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

  // Save the cropped image for debugging
  saveCanvasAsImage(canvas, `row-${rowIndex}-col-${colIndex}-text-color.png`);

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
const processImage = async (imagePath: string) => {
  const image = await loadImage(imagePath);

  const rows: PercentageColorRow[] = [];
  const rowHeight = 86;
  const numRows = 14;

  // Ensure the debug directory exists
  if (!fs.existsSync("./debug")) {
    fs.mkdirSync("./debug");
  }

  const table = [];
  for (let i = 0; i < numRows; i++) {
    // Extract the first and second percentages, cropped properly
    let percentage1 = await extractTextFromImage(
      image,
      0, // source x
      i * rowHeight, // source y (starting point for this row)
      115, // width of the cropped area
      60, // height of the cropped area
      i,
      1,
    );
    let percentage2 = await extractTextFromImage(
      image,
      115, // source x
      i * rowHeight, // source y (same row)
      120, // width of the cropped area
      60, // height of the cropped area
      i,
      2,
    );

    // Clean up the extracted percentages
    const cleanPercentage = (percentage: string) => {
      const match = percentage.match(/[+-]\d+%/);
      return match ? match[0] : percentage;
    };

    percentage1 = cleanPercentage(percentage1);
    percentage2 = cleanPercentage(percentage2);

    const y = 15 + i * rowHeight;

    // Extract the colors
    const color1 = getAverageColor(image, 240, y, 30, 30, i, 1); // First column color
    const color2 = getAverageColor(image, 270, y, 30, 30, i, 2); // Second column color

    // Add the data to the table
    table.push({
      index: i,
      firstPercentage: percentage1,
      secondPercentage: percentage2,
      firstColor: color1,
      secondColor: color2,
    });
  }

  // Output the table
  console.table(table);
};

// Run the function with your image path
processImage("./images/colours.png");
