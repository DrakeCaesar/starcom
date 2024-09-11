// Commodities and conversion rates (Aluminum = 1.0)
const commodityRates = {
  Aluminum: 1.0,
  Copper: 1.5,
  Silver: 2.5,
  Titanium: 5.0,
  Yttrium: 6.5,
  Gold: 8.0,
  Platinum: 10.0,
  Uranium: 11.5,
  Iridium: 25.0,
  DiBeryllium: 45.0,
  Chiralite: 55.0,
  Neutronium: 90.0,
  Etherine: 135.0,
  Xenium: 200.0,
  Adamantine: 500.0,
};
import { factions } from "./factions";

console.clear();

recommendTradeRoutes();

function recommendTradeRoutes() {
  const tableBody = document.querySelector("#tradeRoutes tbody");
  if (tableBody) {
    tableBody.innerHTML = ""; // Clear previous routes
  }

  // Iterate through each commodity
  for (const commodity in commodityRates) {
    let bestBuy = {
      faction: null as string | null,
      price: Infinity,
      percent: Infinity,
    };
    let bestSell = {
      faction: null as string | null,
      price: -Infinity,
      percent: -Infinity,
    };

    // Iterate through factions to find best buy/sell
    for (const factionName in factions) {
      const tradeData = factions[factionName][commodity];

      if (tradeData) {
        // Check for best buy: lowest price with the best discount (negative percentage)
        if (tradeData.buyPercent < bestBuy.percent) {
          bestBuy = {
            faction: factionName,
            price: tradeData.buy,
            percent: tradeData.buyPercent,
          };
        }

        // Check for best sell: highest price with the best premium (positive percentage)
        if (tradeData.sellPercent > bestSell.percent) {
          bestSell = {
            faction: factionName,
            price: tradeData.sell,
            percent: tradeData.sellPercent,
          };
        }
      }
    }

    // Ensure we only display valid routes where buy/sell data exists
    const buyInfo = bestBuy.faction
      ? `${bestBuy.faction} (Buy at ${bestBuy.price.toFixed(2)} / ${
          bestBuy.percent
        }%)`
      : "No Data";
    const sellInfo = bestSell.faction
      ? `${bestSell.faction} (Sell at ${bestSell.price.toFixed(2)} / ${
          bestSell.percent
        }%)`
      : "No Data";

    // Add row to table
    const row = `<tr>
            <td>${commodity}</td>
            <td>${buyInfo}</td>
            <td>${sellInfo}</td>
        </tr>`;
    tableBody?.insertAdjacentHTML("beforeend", row);
  }
}
