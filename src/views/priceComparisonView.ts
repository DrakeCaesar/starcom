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

  // Make the first header cell (Faction) sortable and add reset functionality
  const firstTh = thead.children[0] as HTMLTableCellElement;
  if (firstTh) {
    firstTh.classList.add("sortable", "faction-header");
    firstTh.setAttribute("data-faction", "true");
    firstTh.textContent = "Reset"; // Change text to "Reset"
    firstTh.style.cursor = "pointer";
    firstTh.style.textAlign = "center";

    // Add reset functionality to the entire cell
    firstTh.addEventListener("click", () => {
      // Reset all sort states
      Object.keys(sortState).forEach((key) => {
        sortState[key] = 0;
      });

      // Remove sort indicators from all headers
      const headers = table.querySelectorAll("thead th.sortable");
      headers.forEach((header) => {
        header.classList.remove(
          "sort-asc",
          "sort-desc",
          "active-faction-sort",
          "active-trader-sort"
        );
      });

      // Clear and rebuild the table header with default commodity order
      // Keep the first header cell (Reset)
      while (thead.children.length > 1) {
        const lastChild = thead.lastChild;
        if (lastChild) {
          thead.removeChild(lastChild);
        }
      }

      // Add commodity headers in their original order
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

          // Reset faction sort state
          sortState["faction"] = 0;

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
            if (
              key !== commodityKey &&
              key !== "faction" &&
              !key.startsWith("trader:")
            ) {
              sortState[key] = 0;
            }
          });

          // Update sort indicators
          const headers = table.querySelectorAll("thead th.sortable");
          headers.forEach((header) => {
            header.classList.remove(
              "sort-asc",
              "sort-desc",
              "active-faction-sort",
              "active-trader-sort"
            );
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

      // Repopulate table to its default state without any sorting
      populatePriceTableBody(tableId, priceType, sortState, commodityRates);
    });
  }

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

      // Reset faction sort state
      sortState["faction"] = 0;

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
        if (
          key !== commodityKey &&
          key !== "faction" &&
          !key.startsWith("trader:")
        ) {
          sortState[key] = 0;
        }
      });

      // Update sort indicators
      const headers = table.querySelectorAll("thead th.sortable");
      headers.forEach((header) => {
        header.classList.remove(
          "sort-asc",
          "sort-desc",
          "active-faction-sort",
          "active-trader-sort"
        );
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
  const table = document.getElementById(tableId);
  if (!tbody || !table) return;

  tbody.innerHTML = "";

  // Get all faction names
  const factionNames = Object.keys(factions);

  // Check for trader (faction) column sorting
  const traderSortKey = Object.keys(sortState).find(
    (key) => key.startsWith("trader:") && sortState[key] > 0
  );

  // Get the selected trader name if a trader sort is active
  const selectedTraderName = traderSortKey
    ? traderSortKey.replace("trader:", "")
    : null;

  // Determine if we need to sort by commodity
  let sortedFactions = [...factionNames];
  const sortCommodity = Object.keys(sortState).find(
    (key) =>
      sortState[key] > 0 && key !== "faction" && !key.startsWith("trader:")
  );

  // Sort by commodity (column sorting)
  if (sortCommodity) {
    sortedFactions.sort((a, b) => {
      const factionA = factions[a];
      const factionB = factions[b];

      // Convert to aluminum-equivalent prices for sorting
      const priceA = factionA.commodities[sortCommodity]?.[priceType]
        ? factionA.commodities[sortCommodity][priceType] *
          commodityRates[factionA.currency]
        : Number.MAX_VALUE;

      const priceB = factionB.commodities[sortCommodity]?.[priceType]
        ? factionB.commodities[sortCommodity][priceType] *
          commodityRates[factionB.currency]
        : Number.MAX_VALUE;

      if (sortState[sortCommodity] === 1) {
        // ascending
        return priceA - priceB;
      } else {
        // descending
        return priceB - priceA;
      }
    });
  }
  // Sort by faction (row sorting)
  else if (sortState["faction"] > 0) {
    // Keep original faction order, but we'll sort the commodities when we create the rows
  }

  // Reorder the columns (commodities) based on selected trader if any
  let sortedCommodities = Object.keys(commodityRates);
  if (selectedTraderName) {
    const selectedTraderData = factions[selectedTraderName];
    const traderKey = `trader:${selectedTraderName}`; // Define traderKey here to fix the reference error

    if (selectedTraderData) {
      // Get all commodities with their aluminum-equivalent prices and percentage differences for this trader
      const commoditiesWithPercentages = sortedCommodities.map((commodity) => {
        const commodityData = selectedTraderData.commodities[commodity];
        let percentDiff = null;
        let hasPricing = false;

        if (commodityData && commodityData[priceType]) {
          const currencyRate = commodityRates[selectedTraderData.currency];
          const priceInAluminum = commodityData[priceType] * currencyRate;
          // Calculate percentage difference from base price
          percentDiff = (priceInAluminum / commodityRates[commodity] - 1) * 100;
          hasPricing = true;
        }

        return {
          commodity,
          percentDiff,
          hasPricing,
        };
      });

      // Sort commodities based on their percentage differences for this trader
      commoditiesWithPercentages.sort((a, b) => {
        // Put items with pricing first
        if (a.hasPricing && !b.hasPricing) return -1;
        if (!a.hasPricing && b.hasPricing) return 1;
        if (!a.hasPricing && !b.hasPricing) return 0;

        // For buy prices, lower percentages are better (good deals)
        // For sell prices, higher percentages are better (profitable sales)
        const aValue = a.percentDiff || 0;
        const bValue = b.percentDiff || 0;

        // Sort by percentage difference
        if (sortState[traderKey] === 1) {
          // Ascending order
          return aValue - bValue;
        } else {
          // Descending order
          return bValue - aValue;
        }
      });

      // Update sorted commodities order
      sortedCommodities = commoditiesWithPercentages.map(
        (item) => item.commodity
      );

      // Also need to reorder the table headers to match the new commodity order
      const thead = table.querySelector("thead tr");
      if (thead) {
        // Get all commodity headers (skip the first header which is "Faction")
        const headers = Array.from(thead.querySelectorAll("th"));
        if (headers.length > 1) {
          // Remove all headers except the first one
          for (let i = headers.length - 1; i > 0; i--) {
            thead.removeChild(headers[i]);
          }

          // Recreate headers in the new order
          sortedCommodities.forEach((commodity) => {
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

              // Reset faction sort state
              sortState["faction"] = 0;

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
                if (
                  key !== commodityKey &&
                  key !== "faction" &&
                  !key.startsWith("trader:")
                ) {
                  sortState[key] = 0;
                }
              });

              // Update sort indicators
              const allHeaders = table.querySelectorAll("thead th.sortable");
              allHeaders.forEach((header) => {
                header.classList.remove(
                  "sort-asc",
                  "sort-desc",
                  "active-faction-sort",
                  "active-trader-sort"
                );
                const headerCommodity = header.getAttribute("data-commodity");
                if (headerCommodity && sortState[headerCommodity] === 1) {
                  header.classList.add("sort-asc");
                } else if (
                  headerCommodity &&
                  sortState[headerCommodity] === 2
                ) {
                  header.classList.add("sort-desc");
                }
              });

              // Re-sort and repopulate table
              populatePriceTableBody(
                tableId,
                priceType,
                sortState,
                commodityRates
              );
            });

            thead.appendChild(th);
          });

          // Mark commodity headers as being affected by trader sort
          if (sortState[traderKey] > 0) {
            const allHeaders = table.querySelectorAll("thead th.sortable");
            allHeaders.forEach((header) => {
              if (!header.hasAttribute("data-faction")) {
                header.classList.add("active-trader-sort");
              }
            });
          }
        }
      }
    }
  }

  // Create a row for each faction
  sortedFactions.forEach((factionName) => {
    const factionData = factions[factionName];
    const row = document.createElement("tr");

    // Add faction name cell
    const nameCell = document.createElement("td");
    nameCell.classList.add("clickable-trader");

    // Highlight faction row if it's being used for sorting
    if (sortState["faction"] > 0) {
      nameCell.style.backgroundColor = "rgba(44, 139, 160, 0.3)";
    }

    // Highlight row if it's the selected trader for column sorting
    if (selectedTraderName === factionName) {
      nameCell.classList.add("selected-trader");
      nameCell.style.backgroundColor = "rgba(44, 139, 160, 0.3)";
    }

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

    // Add trader sorting functionality (column sorting)
    nameCell.addEventListener("click", () => {
      const traderKey = `trader:${factionName}`;

      // Reset row sort states
      sortState["faction"] = 0;

      // Reset commodity sort states
      Object.keys(sortState).forEach((key) => {
        if (!key.startsWith("trader:")) {
          sortState[key] = 0;
        }
      });

      // Update trader sort state for this specific trader
      if (!sortState[traderKey]) {
        sortState[traderKey] = 1; // First click: ascending
      } else if (sortState[traderKey] === 1) {
        sortState[traderKey] = 2; // Second click: descending
      } else {
        sortState[traderKey] = 0; // Third click: no sort
      }

      // Reset sort state for other traders
      Object.keys(sortState).forEach((key) => {
        if (key.startsWith("trader:") && key !== traderKey) {
          sortState[key] = 0;
        }
      });

      // Re-populate table with new sorting
      populatePriceTableBody(tableId, priceType, sortState, commodityRates);
    });

    row.appendChild(nameCell);

    // Sort commodities by faction profitability for row sorting
    let rowSortedCommodities = [...sortedCommodities];

    // Sort by faction (row sorting) - only for the current row
    if (sortState["faction"] > 0) {
      // Create a map of commodities with their aluminum-equivalent prices for this faction
      const commodityProfitabilities = rowSortedCommodities.map((commodity) => {
        const commodityData = factionData.commodities[commodity];
        let profitability = 0;
        let hasPricing = false;

        if (commodityData && commodityData[priceType]) {
          const currencyRate = commodityRates[factionData.currency];
          const priceInAluminum = commodityData[priceType] * currencyRate;
          const percentDiff =
            (priceInAluminum / commodityRates[commodity] - 1) * 100;

          // For buy prices, lower is better (negative percentDiff is good)
          // For sell prices, higher is better (positive percentDiff is good)
          profitability = priceType === "buy" ? -percentDiff : percentDiff;
          hasPricing = true;
        }

        return {
          commodity,
          profitability,
          hasPricing,
        };
      });

      // Sort commodities by profitability for this faction
      commodityProfitabilities.sort((a, b) => {
        // Put items with pricing first
        if (a.hasPricing && !b.hasPricing) return -1;
        if (!a.hasPricing && b.hasPricing) return 1;

        // Sort by profitability
        if (sortState["faction"] === 1) {
          // Ascending (least profitable first)
          return a.profitability - b.profitability;
        } else {
          // Descending (most profitable first)
          return b.profitability - a.profitability;
        }
      });

      // Use the sorted commodity list
      rowSortedCommodities = commodityProfitabilities.map(
        (item) => item.commodity
      );
    }

    // Add price cells for each commodity - use the globally sorted commodities, not row-specific sorting
    sortedCommodities.forEach((commodity) => {
      const cell = document.createElement("td");

      const commodityData = factionData.commodities[commodity];
      if (commodityData && commodityData[priceType]) {
        // Calculate price in aluminum for display and color coding
        const currencyRate = commodityRates[factionData.currency];
        const priceInAluminum = commodityData[priceType] * currencyRate;
        const percentDiff =
          (priceInAluminum / commodityRates[commodity] - 1) * 100;

        // Display percentage difference instead of raw aluminum price
        cell.textContent = `${percentDiff >= 0 ? '+' : ''}${percentDiff.toFixed(1)}%`;

        // Add tooltip showing the actual aluminum-equivalent price
        cell.title = `${priceInAluminum.toFixed(2)} Al`;

        // Highlight the cell if it's the sorted column
        if (sortState[commodity] > 0) {
          cell.style.backgroundColor = "rgba(44, 139, 160, 0.3)";
        }

        // Highlight the entire row if this trader is selected
        if (selectedTraderName === factionName) {
          cell.style.backgroundColor = "rgba(44, 139, 160, 0.3)";
        }

        // Set color based on whether it's buy or sell price
        const isBenefit = priceType === "sell" ? true : false;
        const color = getColor(percentDiff, isBenefit);
        cell.style.color = color;
      } else {
        cell.textContent = "-";
        cell.style.color = "#555";

        // Highlight the empty cells too if this trader is selected
        if (selectedTraderName === factionName) {
          cell.style.backgroundColor = "rgba(44, 139, 160, 0.3)";
        }
      }

      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });
}
