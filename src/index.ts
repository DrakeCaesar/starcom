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

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector("button")
    .addEventListener("click", recommendTradeRoutes);
  recommendTradeRoutes();
});

function recommendTradeRoutes() {
  const tableBody = document.querySelector("#tradeRoutes tbody");
  tableBody.innerHTML = ""; // Clear previous routes

  // Iterate through each commodity
  for (const commodity in commodityRates) {
    let bestBuy = { faction: null, price: Infinity, percent: 0 };
    let bestSell = { faction: null, price: 0, percent: 0 };

    // Iterate through factions to find best buy/sell
    for (const faction in factions) {
      const tradeData = factions[faction][commodity];

      if (tradeData) {
        // Check for best buy: lowest price with the best discount (negative percentage)
        if (
          tradeData.buyPercent < 0 &&
          tradeData.buyPercent < bestBuy.percent
        ) {
          bestBuy = {
            faction,
            price: tradeData.buy,
            percent: tradeData.buyPercent,
          };
        }

        // Check for best sell: highest price with the highest profit (positive percentage)
        if (
          tradeData.sellPercent > 0 &&
          tradeData.sellPercent > bestSell.percent
        ) {
          bestSell = {
            faction,
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
    tableBody.insertAdjacentHTML("beforeend", row);
  }
}
