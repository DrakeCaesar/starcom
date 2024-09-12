import { loadImage } from "canvas";
import {
  cleanPercentage,
  ensureDebugDirectoryExists,
  extractTextFromImage,
  handleColorExtractionAndAddToTable,
  sortTableByPercentages,
} from "./utils";

type RGB = [number, number, number];
type PercentageColorRow = {
  percentage1: string;
  percentage2: string;
  color1: RGB;
  color2: RGB;
};

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

// Run the function with your image path
await processImage("./images/colours.png");
process.exit(0);
