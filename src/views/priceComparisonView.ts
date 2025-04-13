import { factions } from "../factions";
import { getColor } from "../getColor";
import { CommodityRate, PriceType } from "../types";

// Setup the price comparison view with all commodities and traders
export function setupPriceComparisonView(commodityRates: CommodityRate) {
  // Create data structure for sorting state
  const sortState: { [key: string]: number } = {}; // 0: no sort, 1: ascending, 2: descending

  // Populate buy prices table
  populatePriceTable("buyPricesTable", "buy", sortState, commodityRates);

  // Populate sell prices table
  populatePriceTable("sellPricesTable", "sell", sortState, commodityRates);
}

// Populate a price table (buy or sell)
function populatePriceTable(
  tableId: string,
  priceType: PriceType,
  sortState: { [key: string]: number },
  commodityRates: CommodityRate
) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const thead = table.querySelector("thead tr");
  const tbody = table.querySelector("tbody");
  if (!thead || !tbody) return;

  // Clear previous content
  // Keep the first header cell (Faction)
  while (thead.children.length > 1) {
    const lastChild = thead.lastChild;
    if (lastChild) {
      thead.removeChild(lastChild);
    }
  }
  tbody.innerHTML = "";

  // Add commodity headers
  Object.keys(commodityRates).forEach((commodity) => {
    const th = document.createElement("th");
    th.classList.add("sortable");
    th.setAttribute("data-commodity", commodity);

    // Create container for icon and name
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";

    // Add commodity icon
    const img = document.createElement("img");
    img.src = `./images/commodities/${commodity}.png`;
    img.alt = commodity;
    container.appendChild(img);

    // Add commodity name
    const span = document.createElement("span");
    span.textContent = commodity;
    container.appendChild(span);

    th.appendChild(container);

    // Add sorting functionality
    th.addEventListener("click", () => {
      const commodityKey = th.getAttribute("data-commodity") || "";

      // Update sort state for this commodity
      if (!sortState[commodityKey]) {
        sortState[commodityKey] = 1; // First click: ascending
      } else if (sortState[commodityKey] === 1) {
        sortState[commodityKey] = 2; // Second click: descending
      } else {
        sortState[commodityKey] = 0; // Third click: no sort
      }

      // Reset sort state for other commodities
      Object.keys(sortState).forEach((key) => {
        if (key !== commodityKey) {
          sortState[key] = 0;
        }
      });

      // Update sort indicators
      const headers = table.querySelectorAll("thead th.sortable");
      headers.forEach((header) => {
        header.classList.remove("sort-asc", "sort-desc");
        const headerCommodity = header.getAttribute("data-commodity");
        if (headerCommodity && sortState[headerCommodity] === 1) {
          header.classList.add("sort-asc");
        } else if (headerCommodity && sortState[headerCommodity] === 2) {
          header.classList.add("sort-desc");
        }
      });

      // Re-sort and repopulate table
      populatePriceTableBody(tableId, priceType, sortState, commodityRates);
    });

    thead.appendChild(th);
  });

  // Populate table body initially
  populatePriceTableBody(tableId, priceType, sortState, commodityRates);
}

// Populate table body with price data and apply sorting
function populatePriceTableBody(
  tableId: string,
  priceType: PriceType,
  sortState: { [key: string]: number },
  commodityRates: CommodityRate
) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!tbody) return;

  tbody.innerHTML = "";

  // Get all faction names
  const factionNames = Object.keys(factions);

  // Determine if we need to sort
  let sortedFactions = [...factionNames];
  const sortCommodity = Object.keys(sortState).find(
    (key) => sortState[key] > 0
  );

  if (sortCommodity) {
    sortedFactions.sort((a, b) => {
      const factionA = factions[a];
      const factionB = factions[b];

      const priceA =
        factionA.commodities[sortCommodity]?.[priceType] || Number.MAX_VALUE;
      const priceB =
        factionB.commodities[sortCommodity]?.[priceType] || Number.MAX_VALUE;

      if (sortState[sortCommodity] === 1) {
        // ascending
        return priceA - priceB;
      } else {
        // descending
        return priceB - priceA;
      }
    });
  }

  // Create a row for each faction
  sortedFactions.forEach((factionName) => {
    const factionData = factions[factionName];

    const row = document.createElement("tr");

    // Add faction name cell
    const nameCell = document.createElement("td");

    // Create container for icon and name
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.alignItems = "center";

    // Add faction avatar
    const avatar = document.createElement("img");
    avatar.src = `./images/avatars/${factionName}.png`;
    avatar.alt = factionName;
    avatar.style.width = "24px";
    avatar.style.height = "24px";
    avatar.style.marginRight = "8px";
    container.appendChild(avatar);

    // Add faction name
    const nameSpan = document.createElement("span");
    nameSpan.textContent = factionName;
    container.appendChild(nameSpan);

    nameCell.appendChild(container);
    row.appendChild(nameCell);

    // Add price cells for each commodity
    Object.keys(commodityRates).forEach((commodity) => {
      const cell = document.createElement("td");

      const commodityData = factionData.commodities[commodity];
      if (commodityData && commodityData[priceType]) {
        cell.textContent = commodityData[priceType].toFixed(2);

        // Highlight the cell if it's the sorted column
        if (sortState[commodity] > 0) {
          cell.style.backgroundColor = "rgba(44, 139, 160, 0.3)";
        }

        // Calculate price in aluminum for color coding
        const currencyRate = commodityRates[factionData.currency];
        const priceInAluminum = commodityData[priceType] * currencyRate;
        const percentDiff =
          (priceInAluminum / commodityRates[commodity] - 1) * 100;

        // Set color based on whether it's buy or sell price
        const isBenefit = priceType === "sell" ? true : false;
        const color = getColor(percentDiff, isBenefit);
        cell.style.color = color;
      } else {
        cell.textContent = "-";
        cell.style.color = "#555";
      }

      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });
}
