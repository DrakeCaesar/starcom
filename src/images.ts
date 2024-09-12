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
  out.on("finish", () => console.log(`Saved ${filename}`));
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
  ctx.drawImage(image, x, y, width, height);

  // Save the cropped image for debugging
  saveCanvasAsImage(canvas, `row-${rowIndex}-col-${colIndex}-text.png`);

  // Convert the canvas to a Buffer for Tesseract
  const buffer = canvas.toBuffer("image/png");

  const result = await Tesseract.recognize(buffer, "eng", {
    logger: (m) => console.log(m),
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
  ctx.drawImage(image, x, y, width, height);

  // Save the cropped image for debugging
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
const processImage = async (imagePath: string) => {
  const image = await loadImage(imagePath);

  const rows: PercentageColorRow[] = [];
  const rowHeight = 86;
  const numRows = 14;

  // Ensure the debug directory exists
  if (!fs.existsSync("./debug")) {
    fs.mkdirSync("./debug");
  }

  for (let i = 0; i < numRows; i++) {
    const y = 25 + i * rowHeight;

    // Extract the first and second percentages
    const percentage1 = await extractTextFromImage(
      image,
      0,
      rowHeight * i,
      110,
      60,
      i,
      1,
    );
    const percentage2 = await extractTextFromImage(
      image,
      110,
      rowHeight * i,
      60,
      40,
      i,
      2,
    );

    // Extract the colors
    const color1 = getAverageColor(image, 255, y, 30, 30, i, 1); // First column color
    const color2 = getAverageColor(image, 285, y, 30, 30, i, 2); // Second column color

    rows.push({ percentage1, percentage2, color1, color2 });
  }

  // Print the table to the console
  console.table(
    rows.map((row) => ({
      "First Percentage": row.percentage1,
      "Second Percentage": row.percentage2,
      "First Color": `rgb(${row.color1[0]}, ${row.color1[1]}, ${row.color1[2]})`,
      "Second Color": `rgb(${row.color2[0]}, ${row.color2[1]}, ${row.color2[2]})`,
    })),
  );
};

// Run the function with your image path
processImage("./images/colours.png");
