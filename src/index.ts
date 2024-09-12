// Commodities and conversion rates (Aluminum = 1.0)
const commodityRates: { [key: string]: number } = {
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

  // Object to store best trade info
  const bestTradeRoutes: {
    [commodity: string]: {
      bestBuyFaction?: string;
      bestBuyPrice?: number;
      bestBuyPriceOG?: number;
      bestBuyCurrency?: string;
      bestBuyPercentage?: number;

      bestSellFaction?: string;
      bestSellPrice?: number;
      bestSellPriceOG?: number;
      bestSellCurrency?: string;
      bestSellPercentage?: number;
    };
  } = {};

  // Iterate through each faction
  for (const factionName in factions) {
    const factionData = factions[factionName];
    const factionCurrency = factionData.currency;
    const currencyRate = commodityRates[factionCurrency];

    console.log(`Processing Faction: ${factionName} (${factionCurrency})`);

    // Iterate through commodities to calculate percentages based on the aluminum conversion
    for (const commodity in commodityRates) {
      const tradeData = factionData.commodities[commodity];

      if (!tradeData) {
        continue;
      }

      // Convert buy and sell prices to aluminum equivalents
      const sellInAluminum = tradeData.sell * currencyRate;
      const buyInAluminum = tradeData.buy * currencyRate;

      // Calculate percentage difference for sell price
      const sellPercentage =
        (sellInAluminum / commodityRates[commodity] - 1) * 100;

      const buyPercentage =
        (buyInAluminum / commodityRates[commodity] - 1) * 100;

      // Initialize if not existing in bestTradeRoutes
      if (!bestTradeRoutes[commodity]) {
        bestTradeRoutes[commodity] = {};
      }

      // Update the best sell price if higher
      if (
        !bestTradeRoutes[commodity].bestSellPrice ||
        sellInAluminum > bestTradeRoutes[commodity].bestSellPrice
      ) {
        bestTradeRoutes[commodity].bestSellFaction = factionName;
        bestTradeRoutes[commodity].bestSellPrice = sellInAluminum;
        bestTradeRoutes[commodity].bestSellPriceOG = tradeData.sell;
        bestTradeRoutes[commodity].bestSellCurrency = factionCurrency;
        bestTradeRoutes[commodity].bestSellPercentage = sellPercentage;
      }

      // Update the best buy price if lower
      if (
        !bestTradeRoutes[commodity].bestBuyPrice ||
        buyInAluminum < bestTradeRoutes[commodity].bestBuyPrice
      ) {
        bestTradeRoutes[commodity].bestBuyFaction = factionName;
        bestTradeRoutes[commodity].bestBuyPrice = buyInAluminum;
        bestTradeRoutes[commodity].bestBuyPriceOG = tradeData.buy;
        bestTradeRoutes[commodity].bestBuyCurrency = factionCurrency;
        bestTradeRoutes[commodity].bestBuyPercentage = buyPercentage;
      }
    }
  }

  // Now display the best trade routes, in the same order as commodityRates
  for (const commodity in commodityRates) {
    const tradeInfo = bestTradeRoutes[commodity];

    if (tradeInfo && tradeInfo.bestBuyFaction && tradeInfo.bestSellFaction) {
      const sellInfo = `
      ${tradeInfo.bestSellPriceOG?.toFixed(2)} 
      ${tradeInfo.bestSellCurrency} 
      ${tradeInfo.bestSellPercentage?.toFixed(0)}% 
      ${tradeInfo.bestSellFaction}`;

      const buyInfo = `
      ${tradeInfo.bestBuyPriceOG?.toFixed(2)}
      ${tradeInfo.bestBuyCurrency}
      ${tradeInfo.bestBuyPercentage?.toFixed(0)}%
      ${tradeInfo.bestBuyFaction}`;

      // Add row to table
      const row = `<tr>
          <td>${commodity}</td>
          <td>${sellInfo}</td>
          <td>${buyInfo}</td>
      </tr>`;
      tableBody?.insertAdjacentHTML("beforeend", row);
    }
  }
}
