import { factions } from "./factions";
import "./styles.scss";

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

console.clear();

recommendTradeRoutes();

function recommendTradeRoutes() {
  const tableBody = document.querySelector("#tradeRoutes tbody");
  if (tableBody) {
    tableBody.innerHTML = ""; // Clear previous routes
  }

  // Array to store all trade combinations
  const allTradeRoutes: {
    commodity: string;
    bestBuyFaction: string;
    bestBuyPrice: number;
    bestBuyPriceOG: number;
    bestBuyCurrency: string;
    bestBuyPercentage: number;
    bestSellFaction: string;
    bestSellPrice: number;
    bestSellPriceOG: number;
    bestSellCurrency: string;
    bestSellPercentage: number;
    profitPercentage: number;
  }[] = [];

  // Iterate through each faction to get all trade combinations
  for (const buyFactionName in factions) {
    const buyFactionData = factions[buyFactionName];
    const buyCurrencyRate = commodityRates[buyFactionData.currency];

    for (const sellFactionName in factions) {
      if (buyFactionName === sellFactionName) continue; // Skip if the buy and sell factions are the same

      const sellFactionData = factions[sellFactionName];
      const sellCurrencyRate = commodityRates[sellFactionData.currency];

      for (const commodity in commodityRates) {
        const buyTradeData = buyFactionData.commodities[commodity];
        const sellTradeData = sellFactionData.commodities[commodity];

        if (!buyTradeData || !sellTradeData) continue; // Skip if no trade data for the commodity

        // Convert buy and sell prices to aluminum equivalents
        const buyInAluminum = buyTradeData.buy * buyCurrencyRate;
        const sellInAluminum = sellTradeData.sell * sellCurrencyRate;

        // Calculate profit percentage
        const profitPercentage = (sellInAluminum / buyInAluminum - 1) * 100;

        // Store the trade combination with calculated profit
        allTradeRoutes.push({
          commodity,
          bestBuyFaction: buyFactionName,
          bestBuyPrice: buyInAluminum,
          bestBuyPriceOG: buyTradeData.buy,
          bestBuyCurrency: buyFactionData.currency,
          bestBuyPercentage:
            (buyInAluminum / commodityRates[commodity] - 1) * 100,
          bestSellFaction: sellFactionName,
          bestSellPrice: sellInAluminum,
          bestSellPriceOG: sellTradeData.sell,
          bestSellCurrency: sellFactionData.currency,
          bestSellPercentage:
            (sellInAluminum / commodityRates[commodity] - 1) * 100,
          profitPercentage,
        });
      }
    }
  }

  // Sort all trade routes by profit percentage in descending order
  allTradeRoutes.sort((a, b) => b.profitPercentage - a.profitPercentage);

  // Now display the sorted trade routes
  allTradeRoutes.forEach((tradeInfo) => {
    const profit =
      tradeInfo.profitPercentage > 0
        ? `+${tradeInfo.profitPercentage.toFixed(2)}%`
        : `${tradeInfo.profitPercentage.toFixed(2)}%`;

    const row = `<tr>
         <td>${tradeInfo.commodity}</td>
         <td class="currency" style="background-image: url('./images/commodities/${
           tradeInfo.commodity
         }.png');"></td>
         <td class="empty"></td>

         <!-- Sell Info Columns -->
         <td>${tradeInfo.bestSellPriceOG.toFixed(2)}</td>
         <td>${tradeInfo.bestSellPercentage.toFixed(0)}%</td>
         <td>${tradeInfo.bestSellFaction}</td>
         <td>${tradeInfo.bestSellCurrency}</td>
         <td class="currency" style="background-image: url('./images/commodities/${
           tradeInfo.bestSellCurrency
         }.png');"></td>
         <td class="empty"></td>

         <!-- Buy Info Columns -->
         <td>${tradeInfo.bestBuyPriceOG.toFixed(2)}</td>
         <td>${tradeInfo.bestBuyPercentage.toFixed(0)}%</td>
         <td>${tradeInfo.bestBuyFaction}</td>
         <td>${tradeInfo.bestBuyCurrency}</td>
         <td class="currency" style="background-image: url('./images/commodities/${
           tradeInfo.bestBuyCurrency
         }.png');"></td>
         
         <!-- Profit Column -->
         <td>${profit}</td>
     </tr>`;
    tableBody?.insertAdjacentHTML("beforeend", row);
  });
}
