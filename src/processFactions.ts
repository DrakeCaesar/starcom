import { loadImage } from "canvas";
import { readdirSync } from "fs";
import { join } from "path";
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
  sellPrice: string;
  buyPrice: string;
};

async function processAllImages() {
  const imagesPath = "./images/data/";
  const files = readdirSync(imagesPath).filter((file) => file.endsWith(".png"));

  ensureDebugDirectoryExists();

  const allFactionsData = [];

  for (const file of files) {
    const imagePath = join(imagesPath, file);
    console.log(`Processing image: ${imagePath}`);
    const factionName = file.replace(".png", "");
    const imageTable = await processImage(imagePath);

    allFactionsData.push({
      factionName,
      data: imageTable,
    });
    break;
  }

  console.log(JSON.stringify(allFactionsData, null, 2));
}

async function processImage(imagePath: string) {
  const image = await loadImage(imagePath);

  const table: {
    firstPercentage: string;
    firstColor: string;
    secondPercentage: string;
    secondColor: string;
    sellPrice: string;
    buyPrice: string;
  }[] = [];

  const rowHeight = 86;
  const numRows = 14;
  const percentagePromises = [];

  for (let i = 0; i < numRows; i++) {
    percentagePromises.push(handleRow(image, i, rowHeight, table));
  }

  await Promise.all(percentagePromises);

  const sortedTable = sortTableByPercentages(table);
  return sortedTable;
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
    sellPrice: string;
    buyPrice: string;
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

  const sellPricePromise = extractTextFromImage(
    image,
    235,
    rowIndex * rowHeight,
    120,
    60,
    rowIndex,
    3,
  );
  const buyPricePromise = extractTextFromImage(
    image,
    355,
    rowIndex * rowHeight,
    120,
    60,
    rowIndex,
    4,
  );

  const [percentage1, percentage2, sellPrice, buyPrice] = await Promise.all([
    percentage1Promise,
    percentage2Promise,
    sellPricePromise,
    buyPricePromise,
  ]);

  await handleColorExtractionAndAddToTable(
    image,
    rowIndex,
    rowHeight,
    cleanPercentage(percentage1),
    cleanPercentage(percentage2),
    table,
  );

  table[rowIndex].sellPrice = sellPrice;
  table[rowIndex].buyPrice = buyPrice;
}

// Run the function to process all images in the directory
await processAllImages();
process.exit(0);
