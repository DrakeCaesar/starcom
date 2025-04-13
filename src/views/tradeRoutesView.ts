import { factions } from "../factions";
import { getColor } from "../getColor";
import { CommodityRate, TradeRoute } from "../types";

export function recommendTradeRoutes(commodityRates: CommodityRate) {
  const tableBody = document.querySelector("#tradeRoutes tbody");
  if (tableBody) {
    tableBody.innerHTML = ""; // Clear previous routes
  }

  // Array to store all trade combinations
  const allTradeRoutes: TradeRoute[] = [];

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
          bestSellFaction: buyFactionName,
          bestSellPrice: sellInAluminum,
          bestSellPriceOG: buyTradeData.sell,
          bestSellCurrency: buyFactionData.currency,
          bestSellPercentage:
            (sellInAluminum / commodityRates[commodity] - 1) * 100,
          bestBuyFaction: sellFactionName,
          bestBuyPrice: buyInAluminum,
          bestBuyPriceOG: sellTradeData.buy,
          bestBuyCurrency: sellFactionData.currency,
          bestBuyPercentage:
            (buyInAluminum / commodityRates[commodity] - 1) * 100,
          profitPercentage,
        });
      }
    }
  }

  // Sort all trade routes by profit percentage in descending order
  allTradeRoutes.sort((a, b) => b.profitPercentage - a.profitPercentage);

  // Add table headers
  const tableHeaders = `
  <thead>
    <tr>
      <th colspan="2">Commodity</th>
      <th class="empty"></th>
      <th colspan="5">Buy From</th>
      <th class="empty"></th>
      <th colspan="5">Sell To</th>
      <th class="empty"></th>
      <th>Profit</th>
    </tr>
  </thead>
`;

  // Now display the sorted trade routes
  allTradeRoutes.forEach((tradeInfo, index) => {
    const profit =
      tradeInfo.profitPercentage > 0
        ? `+${tradeInfo.profitPercentage.toFixed(2)}%`
        : `${tradeInfo.profitPercentage.toFixed(2)}%`;

    const buyPercentageColor = getColor(tradeInfo.bestBuyPercentage, false);
    const sellPercentageColor = getColor(tradeInfo.bestSellPercentage, true);
    const profitPercentageColor = getColor(tradeInfo.profitPercentage, true);

    const row = `<tr>
    <td>${tradeInfo.commodity}</td>
    <td class="currency" style="background-image: url('./images/commodities/${
      tradeInfo.commodity
    }.png');"></td>
    <td class="empty"></td>

    <!-- Buy Info Columns -->
    <td>${tradeInfo.bestBuyFaction}</td>
    <td class="avatar" style="background-image: url('./images/avatars/${
      tradeInfo.bestBuyFaction
    }.png');"></td>
    <td class="currency" style="background-image: url('./images/commodities/${
      tradeInfo.bestBuyCurrency
    }.png');"></td>
    <td class="left-align-right">${tradeInfo.bestBuyPriceOG.toFixed(2)}</td>
    <td class="left-align-right" style="color: ${buyPercentageColor};">
      ${tradeInfo.bestBuyPercentage.toFixed(0)}%
    </td>
    <td class="empty"></td>

    <!-- Sell Info Columns -->
    <td>${tradeInfo.bestSellFaction}</td>
    <td class="avatar" style="background-image: url('./images/avatars/${
      tradeInfo.bestSellFaction
    }.png');"></td>
    <td class="currency" style="background-image: url('./images/commodities/${
      tradeInfo.bestSellCurrency
    }.png');"></td>
    <td class="left-align-right">${tradeInfo.bestSellPriceOG.toFixed(2)}</td>
    <td class="left-align-right" style="color: ${sellPercentageColor};">
      ${tradeInfo.bestSellPercentage.toFixed(0)}%
    </td>
    <td class="empty"></td>

    <!-- Profit Column -->
    <td class="left-align-right" style="color: ${profitPercentageColor};">
      ${profit}
    </td>
</tr>`;

    // Insert headers before the first row
    if (index === 0) {
      tableBody?.insertAdjacentHTML("beforeend", tableHeaders);
    }

    tableBody?.insertAdjacentHTML("beforeend", row);
  });
}
