import { factions } from "../factions";
import { getColor } from "../getColor";
import { CommodityRate } from "../types";

// Populate the commodity table in the commodities view
export function populateCommodityTable(commodityRates: CommodityRate) {
  const commodityTable = document
    .getElementById("commodityTable")
    ?.querySelector("tbody");
  if (!commodityTable) return;

  commodityTable.innerHTML = "";

  // Sort commodities by value
  const commodities = Object.keys(commodityRates).sort(
    (a, b) => commodityRates[a] - commodityRates[b]
  );

  // Create a row for each commodity
  commodities.forEach((commodity) => {
    const row = document.createElement("tr");

    // Commodity name and icon
    const nameCell = document.createElement("td");

    // Create container for icon and name
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.alignItems = "center";

    // Add commodity icon
    const img = document.createElement("img");
    img.src = `./images/commodities/${commodity}.png`;
    img.alt = commodity;
    img.style.width = "24px";
    img.style.height = "24px";
    img.style.marginRight = "8px";
    container.appendChild(img);

    // Add commodity name
    const nameSpan = document.createElement("span");
    nameSpan.textContent = commodity;
    container.appendChild(nameSpan);

    nameCell.appendChild(container);
    row.appendChild(nameCell);

    // Commodity value
    const valueCell = document.createElement("td");
    valueCell.textContent = commodityRates[commodity].toString();
    valueCell.classList.add("numeric");
    row.appendChild(valueCell);

    // Add click event to show sellers and buyers for this commodity
    row.addEventListener("click", () => {
      // Highlight the selected row
      commodityTable
        .querySelectorAll("tr")
        .forEach((r) => r.classList.remove("selected"));
      row.classList.add("selected");

      // Show sellers for this commodity
      showSellersForCommodity(commodity, commodityRates);

      // Show buyers for this commodity
      showBuyersForCommodity(commodity, commodityRates);
    });

    commodityTable.appendChild(row);
  });

  // Initial selection - show the first commodity
  if (commodities.length > 0) {
    const firstRow = commodityTable.querySelector("tr");
    if (firstRow) {
      firstRow.classList.add("selected");
      showSellersForCommodity(commodities[0], commodityRates);
      showBuyersForCommodity(commodities[0], commodityRates);
    }
  }
}

// Show sellers for a specific commodity
export function showSellersForCommodity(
  commodity: string,
  commodityRates: CommodityRate
) {
  const sellersTable = document
    .getElementById("sellersTable")
    ?.querySelector("tbody");
  if (!sellersTable) return;

  sellersTable.innerHTML = "";

  // Get all factions and their prices for this commodity
  const factionsWithPrices = Object.keys(factions)
    .filter((faction) => factions[faction].commodities[commodity]?.buy)
    .map((faction) => ({
      name: faction,
      data: factions[faction],
      priceInAluminum:
        factions[faction].commodities[commodity].buy *
        commodityRates[factions[faction].currency],
      percentDiff:
        ((factions[faction].commodities[commodity].buy *
          commodityRates[factions[faction].currency]) /
          commodityRates[commodity] -
          1) *
        100,
    }))
    .sort((a, b) => a.priceInAluminum - b.priceInAluminum);

  // Create rows for each faction
  factionsWithPrices.forEach((factionData) => {
    const row = document.createElement("tr");

    // Faction name and avatar
    const nameCell = document.createElement("td");
    nameCell.textContent = factionData.name;
    row.appendChild(nameCell);

    const avatarCell = document.createElement("td");
    avatarCell.classList.add("avatar");
    avatarCell.style.backgroundImage = `url('./images/avatars/${factionData.name}.png')`;
    row.appendChild(avatarCell);

    // Currency
    const currencyCell = document.createElement("td");
    currencyCell.classList.add("currency");
    currencyCell.style.backgroundImage = `url('./images/commodities/${factionData.data.currency}.png')`;
    row.appendChild(currencyCell);

    // Buy price
    const priceCell = document.createElement("td");
    priceCell.classList.add("numeric");

    // Display aluminum-equivalent price instead of raw price
    priceCell.textContent = factionData.priceInAluminum.toFixed(2);

    // Add currency indicator - small Aluminum icon/text
    const currencyIndicator = document.createElement("span");
    currencyIndicator.textContent = " Al";
    currencyIndicator.style.fontSize = "0.8em";
    currencyIndicator.style.opacity = "0.7";
    priceCell.appendChild(currencyIndicator);

    row.appendChild(priceCell);

    // Percentage difference
    const diffCell = document.createElement("td");
    diffCell.classList.add("numeric");
    diffCell.textContent = factionData.percentDiff.toFixed(2) + "%";
    diffCell.style.color = getColor(factionData.percentDiff, false);
    row.appendChild(diffCell);

    sellersTable.appendChild(row);
  });
}

// Show buyers for a specific commodity (sell prices)
export function showBuyersForCommodity(
  commodity: string,
  commodityRates: CommodityRate
) {
  const buyersTable = document
    .getElementById("buyersTable")
    ?.querySelector("tbody");
  if (!buyersTable) return;

  buyersTable.innerHTML = "";

  // Get all factions and their prices for this commodity
  const factionsWithPrices = Object.keys(factions)
    .filter((faction) => factions[faction].commodities[commodity]?.sell)
    .map((faction) => ({
      name: faction,
      data: factions[faction],
      priceInAluminum:
        factions[faction].commodities[commodity].sell *
        commodityRates[factions[faction].currency],
      percentDiff:
        ((factions[faction].commodities[commodity].sell *
          commodityRates[factions[faction].currency]) /
          commodityRates[commodity] -
          1) *
        100,
    }))
    .sort((a, b) => b.priceInAluminum - a.priceInAluminum); // Sort highest price first for sell prices

  // Create rows for each faction
  factionsWithPrices.forEach((factionData) => {
    const row = document.createElement("tr");

    // Faction name and avatar
    const nameCell = document.createElement("td");
    nameCell.textContent = factionData.name;
    row.appendChild(nameCell);

    const avatarCell = document.createElement("td");
    avatarCell.classList.add("avatar");
    avatarCell.style.backgroundImage = `url('./images/avatars/${factionData.name}.png')`;
    row.appendChild(avatarCell);

    // Currency
    const currencyCell = document.createElement("td");
    currencyCell.classList.add("currency");
    currencyCell.style.backgroundImage = `url('./images/commodities/${factionData.data.currency}.png')`;
    row.appendChild(currencyCell);

    // Sell price
    const priceCell = document.createElement("td");
    priceCell.classList.add("numeric");

    // Display aluminum-equivalent price instead of raw price
    priceCell.textContent = factionData.priceInAluminum.toFixed(2);

    // Add currency indicator - small Aluminum icon/text
    const currencyIndicator = document.createElement("span");
    currencyIndicator.textContent = " Al";
    currencyIndicator.style.fontSize = "0.8em";
    currencyIndicator.style.opacity = "0.7";
    priceCell.appendChild(currencyIndicator);

    row.appendChild(priceCell);

    // Percentage difference
    const diffCell = document.createElement("td");
    diffCell.classList.add("numeric");
    diffCell.textContent = factionData.percentDiff.toFixed(2) + "%";
    diffCell.style.color = getColor(factionData.percentDiff, true); // Use true for sell prices
    row.appendChild(diffCell);

    buyersTable.appendChild(row);
  });
}
