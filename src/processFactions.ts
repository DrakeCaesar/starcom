import { loadImage } from "canvas";
import { readdirSync } from "fs";
import { join } from "path";
import { ensureDebugDirectoryExists, extractTextFromImage } from "./utils";

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
    const factionName = file.replace(".png", "");
    const imageTable = await processImage(imagePath);

    allFactionsData.push({
      factionName,
      data: imageTable,
    });
    break;
  }

  // console.log(JSON.stringify(allFactionsData, null, 2));
}

async function processImage(imagePath: string) {
  const image = await loadImage(imagePath);

  const table: {
    rowIndex: number;
    count1: string;
    count2: string;
    sellProc: string;
    buyProc: string;
    sellPrice: string;
    buyPrice: string;
  }[] = [];

  const rowHeight = 43;
  const numRows = 14;
  const percentagePromises = [];

  for (let i = 0; i < numRows; i++) {
    percentagePromises.push(handleRow(image, i, rowHeight, table));
  }

  await Promise.all(percentagePromises);

  // Sort the table based on rowIndex to maintain the correct order
  table.sort((a, b) => a.rowIndex - b.rowIndex);

  console.table(table);

  return table;
}

async function handleRow(
  image: any,
  rowIndex: number,
  rowHeight: number,
  table: {
    rowIndex: number;
    count1: string;
    count2: string;
    sellProc: string;
    buyProc: string;
    sellPrice: string;
    buyPrice: string;
  }[],
) {
  const count1Promise = extractTextFromImage(
    image,
    422,
    324 + rowIndex * rowHeight,
    62,
    14,
    rowIndex,
    0,
  );

  const count2Promise = extractTextFromImage(
    image,
    570,
    324 + rowIndex * rowHeight,
    62,
    14,
    rowIndex,
    1,
  );

  const pricePromise = extractTextFromImage(
    image,
    763,
    325 + rowIndex * rowHeight,
    110,
    14,
    rowIndex,
    1,
  );

  const percPromise = extractTextFromImage(
    image,
    873,
    325 + rowIndex * rowHeight,
    140,
    14,
    rowIndex,
    1,
  );

  const [count1, count2, price, perc] = await Promise.all([
    count1Promise,
    count2Promise,
    pricePromise,
    percPromise,
  ]);

  const percentage1 = perc.split("/")[0].trim();
  const percentage2 = perc.split("/")[1].trim();
  const sellPrice = price.split("/")[0].trim();
  const buyPrice = price.split("/")[1].trim();

  table.push({
    rowIndex,
    count1,
    count2,
    sellProc: percentage1,
    buyProc: percentage2,
    sellPrice,
    buyPrice,
  });
}

// Run the function to process all images in the directory
await processAllImages();

process.exit(0);
