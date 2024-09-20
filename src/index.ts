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

        // Correctly use sell price for buying and buy price for selling
        const buyInAluminum = sellTradeData.buy * sellCurrencyRate;
        const sellInAluminum = buyTradeData.sell * buyCurrencyRate;

        // Calculate profit percentage
        const profitPercentage =
          ((sellInAluminum - buyInAluminum) / buyInAluminum) * 100;

        // Store the trade combination with calculated profit
        allTradeRoutes.push({
          commodity,
          bestBuyFaction: buyFactionName,
          bestBuyPrice: sellInAluminum,
          bestBuyPriceOG: buyTradeData.sell, // Update to reflect the correct original price
          bestBuyCurrency: buyFactionData.currency,
          bestBuyPercentage:
            (sellInAluminum / commodityRates[commodity] - 1) * 100,
          bestSellFaction: sellFactionName,
          bestSellPrice: buyInAluminum,
          bestSellPriceOG: sellTradeData.buy, // Update to reflect the correct original price
          bestSellCurrency: sellFactionData.currency,
          bestSellPercentage:
            (buyInAluminum / commodityRates[commodity] - 1) * 100,
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
  
        <td>${tradeInfo.bestSellFaction}</td>
        
        <td class="avatar" style="background-image: url('./images/avatars/${
          tradeInfo.bestSellFaction
        }.png');"></td>
        
        <!-- <td>${tradeInfo.bestSellCurrency}</td> -->
         
        
        <td class="currency" style="background-image: url('./images/commodities/${
          tradeInfo.bestSellCurrency
        }.png');"></td>
        
        <td class="left-align-right">${tradeInfo.bestSellPriceOG.toFixed(2)}</td>
        
        <td class="left-align-right">${tradeInfo.bestSellPercentage.toFixed(0)}%</td>
        
        <td class="empty"></td>
        
        
  
        <!-- Buy Info Columns -->
        <td>${tradeInfo.bestBuyFaction}</td>
        
        <td class="avatar" style="background-image: url('./images/avatars/${
          tradeInfo.bestBuyFaction
        }.png');"></td>
        
        <!-- <td>${tradeInfo.bestBuyCurrency}</td> -->
        
        <td class="left-align-right">${tradeInfo.bestBuyPriceOG.toFixed(2)}</td>
        
        <td class="currency" style="background-image: url('./images/commodities/${
          tradeInfo.bestBuyCurrency
        }.png');"></td>
        
        <td class="left-align-right">${tradeInfo.bestBuyPercentage.toFixed(0)}%</td>
        
        <td class="empty"></td>
        
        
        <!-- Profit Column -->
        <td class="left-align-right">${profit}</td>
     </tr>`;
    tableBody?.insertAdjacentHTML("beforeend", row);
  });
}
