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

  // Iterate through each faction
  for (const factionName in factions) {
    const factionData = factions[factionName];

    // Determine the faction's currency
    let factionCurrency: string | null = null;

    for (const commodity in commodityRates) {
      if (!factionData[commodity]) {
        factionCurrency = commodity;
        break; // We found the commodity they don't sell, so it must be their currency
      }
    }

    if (!factionCurrency) {
      console.error(`Currency not found for faction: ${factionName}`);
      continue; // Skip if we can't determine the currency
    }

    const currencyRate = commodityRates[factionCurrency];

    console.log(`Faction: ${factionName} (${factionCurrency})`);

    // Iterate through commodities to calculate percentages based on the aluminum conversion
    for (const commodity in commodityRates) {
      const tradeData = factionData[commodity];

      if (!tradeData || commodity === factionCurrency) {
        continue; // Skip the faction currency
      }

      const commodityRate = commodityRates[commodity];

      // Convert buy and sell prices to aluminum equivalents
      const buyInAluminum = tradeData.buy * currencyRate;
      const sellInAluminum = tradeData.sell * currencyRate;

      // Calculate the true percentage difference compared to the commodity's standard aluminum value
      const trueBuyPercentage = (buyInAluminum / commodityRate - 1) * 100;
      const trueSellPercentage = (sellInAluminum / commodityRate - 1) * 100;

      // Display the calculated values
      const buyInfo = `Buy at ${buyInAluminum.toFixed(
        2,
      )} (True Percentage: ${trueBuyPercentage.toFixed(2)}%)`;
      const sellInfo = `Sell at ${sellInAluminum.toFixed(
        2,
      )} (True Percentage: ${trueSellPercentage.toFixed(2)}%)`;

      // Add row to table
      const row = `<tr>
          <td>${commodity}</td>
          <td>${factionName} (${buyInfo})</td>
          <td>${factionName} (${sellInfo})</td>
      </tr>`;
      tableBody?.insertAdjacentHTML("beforeend", row);
    }
  }
}
