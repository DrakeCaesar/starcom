import { factions } from "./factions";
import { getColor } from "./getColor";
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

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  populateCommodityTable();
  setupPriceComparisonView();
  recommendTradeRoutes();
});

// Setup navigation between views
function setupNavigation() {
  const tradeRoutesViewBtn = document.getElementById('tradeRoutesViewBtn');
  const commoditiesViewBtn = document.getElementById('commoditiesViewBtn');
  const priceComparisonViewBtn = document.getElementById('priceComparisonViewBtn');
  const tradeRoutesView = document.getElementById('tradeRoutesView');
  const commoditiesView = document.getElementById('commoditiesView');
  const priceComparisonView = document.getElementById('priceComparisonView');
  
  tradeRoutesViewBtn?.addEventListener('click', () => {
    tradeRoutesViewBtn.classList.add('active');
    commoditiesViewBtn?.classList.remove('active');
    priceComparisonViewBtn?.classList.remove('active');
    tradeRoutesView?.classList.add('active');
    commoditiesView?.classList.remove('active');
    priceComparisonView?.classList.remove('active');
  });
  
  commoditiesViewBtn?.addEventListener('click', () => {
    commoditiesViewBtn.classList.add('active');
    tradeRoutesViewBtn?.classList.remove('active');
    priceComparisonViewBtn?.classList.remove('active');
    commoditiesView?.classList.add('active');
    tradeRoutesView?.classList.remove('active');
    priceComparisonView?.classList.remove('active');
  });
  
  priceComparisonViewBtn?.addEventListener('click', () => {
    priceComparisonViewBtn.classList.add('active');
    tradeRoutesViewBtn?.classList.remove('active');
    commoditiesViewBtn?.classList.remove('active');
    priceComparisonView?.classList.add('active');
    tradeRoutesView?.classList.remove('active');
    commoditiesView?.classList.remove('active');
  });
  
  // Setup tab navigation for price comparison view
  const buyPricesTabBtn = document.getElementById('buyPricesTabBtn');
  const sellPricesTabBtn = document.getElementById('sellPricesTabBtn');
  const buyPricesTab = document.getElementById('buyPricesTab');
  const sellPricesTab = document.getElementById('sellPricesTab');
  
  buyPricesTabBtn?.addEventListener('click', () => {
    buyPricesTabBtn.classList.add('active');
    sellPricesTabBtn?.classList.remove('active');
    buyPricesTab?.classList.add('active');
    sellPricesTab?.classList.remove('active');
  });
  
  sellPricesTabBtn?.addEventListener('click', () => {
    sellPricesTabBtn.classList.add('active');
    buyPricesTabBtn?.classList.remove('active');
    sellPricesTab?.classList.add('active');
    buyPricesTab?.classList.remove('active');
  });
}

// Populate the commodity table in the commodities view
function populateCommodityTable() {
  const commodityTable = document.getElementById('commodityTable')?.querySelector('tbody');
  if (!commodityTable) return;
  
  commodityTable.innerHTML = '';
  
  // Sort commodities by value
  const commodities = Object.keys(commodityRates)
    .sort((a, b) => commodityRates[a] - commodityRates[b]);
  
  // Create a row for each commodity
  commodities.forEach(commodity => {
    const row = document.createElement('tr');
    
    // Commodity name and icon
    const nameCell = document.createElement('td');
    
    // Create container for icon and name
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    
    // Add commodity icon
    const img = document.createElement('img');
    img.src = `./images/commodities/${commodity}.png`;
    img.alt = commodity;
    img.style.width = '24px';
    img.style.height = '24px';
    img.style.marginRight = '8px';
    container.appendChild(img);
    
    // Add commodity name
    const nameSpan = document.createElement('span');
    nameSpan.textContent = commodity;
    container.appendChild(nameSpan);
    
    nameCell.appendChild(container);
    row.appendChild(nameCell);
    
    // Commodity value
    const valueCell = document.createElement('td');
    valueCell.textContent = commodityRates[commodity].toString();
    valueCell.classList.add('numeric');
    row.appendChild(valueCell);
    
    // Add click event to show sellers for this commodity
    row.addEventListener('click', () => {
      // Highlight the selected row
      commodityTable.querySelectorAll('tr').forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
      
      // Show sellers for this commodity
      showSellersForCommodity(commodity);
    });
    
    commodityTable.appendChild(row);
  });
  
  // Initial selection - show the first commodity
  if (commodities.length > 0) {
    const firstRow = commodityTable.querySelector('tr');
    if (firstRow) {
      firstRow.classList.add('selected');
      showSellersForCommodity(commodities[0]);
    }
  }
}

// Show sellers for a specific commodity
function showSellersForCommodity(commodity: string) {
  const sellersTable = document.getElementById('sellersTable')?.querySelector('tbody');
  if (!sellersTable) return;
  
  sellersTable.innerHTML = '';
  
  // Get all factions and their prices for this commodity
  const factionsWithPrices = Object.keys(factions)
    .filter(faction => factions[faction].commodities[commodity])
    .map(faction => ({
      name: faction,
      data: factions[faction],
      priceInAluminum: factions[faction].commodities[commodity].buy * 
                      commodityRates[factions[faction].currency],
      percentDiff: ((factions[faction].commodities[commodity].buy * 
                   commodityRates[factions[faction].currency] / 
                   commodityRates[commodity]) - 1) * 100
    }))
    .sort((a, b) => a.priceInAluminum - b.priceInAluminum);
  
  // Create rows for each faction
  factionsWithPrices.forEach(factionData => {
    const row = document.createElement('tr');
    
    // Faction name and avatar
    const nameCell = document.createElement('td');
    nameCell.textContent = factionData.name;
    row.appendChild(nameCell);
    
    const avatarCell = document.createElement('td');
    avatarCell.classList.add('avatar');
    avatarCell.style.backgroundImage = `url('./images/avatars/${factionData.name}.png')`;
    row.appendChild(avatarCell);
    
    // Currency
    const currencyCell = document.createElement('td');
    currencyCell.classList.add('currency');
    currencyCell.style.backgroundImage = 
      `url('./images/commodities/${factionData.data.currency}.png')`;
    row.appendChild(currencyCell);
    
    // Buy price
    const priceCell = document.createElement('td');
    priceCell.classList.add('numeric');
    priceCell.textContent = factionData.data.commodities[commodity].buy.toFixed(2);
    row.appendChild(priceCell);
    
    // Percentage difference
    const diffCell = document.createElement('td');
    diffCell.classList.add('numeric');
    diffCell.textContent = factionData.percentDiff.toFixed(2) + '%';
    diffCell.style.color = getColor(factionData.percentDiff, false);
    row.appendChild(diffCell);
    
    sellersTable.appendChild(row);
  });
}

function recommendTradeRoutes() {
  const tableBody = document.querySelector("#tradeRoutes tbody");
  if (tableBody) {
    tableBody.innerHTML = ""; // Clear previous routes
  }

  // Array to store all trade combinations
  const allTradeRoutes = [];

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

  let totalTime = 0;

  // Now display the sorted trade routes
  allTradeRoutes.forEach((tradeInfo, index) => {
    const profit =
      tradeInfo.profitPercentage > 0
        ? `+${tradeInfo.profitPercentage.toFixed(2)}%`
        : `${tradeInfo.profitPercentage.toFixed(2)}%`;

    // Measure time for getColor calls
    let startTime = Date.now();
    const buyPercentageColor = getColor(tradeInfo.bestBuyPercentage, false);
    let endTime = Date.now();
    totalTime += endTime - startTime;

    startTime = Date.now();
    const sellPercentageColor = getColor(tradeInfo.bestSellPercentage, true);
    endTime = Date.now();
    totalTime += endTime - startTime;

    startTime = Date.now();
    const profitPercentageColor = getColor(tradeInfo.profitPercentage, true);
    endTime = Date.now();
    totalTime += endTime - startTime;

    // If it's the last iteration, print the total time
    if (index === allTradeRoutes.length - 1) {
      console.log(`Total time taken for getColor calls: ${totalTime} ms`);
    }

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

// Setup the price comparison view with all commodities and traders
function setupPriceComparisonView() {
  // Create data structure for sorting state
  const sortState: { [key: string]: number } = {}; // 0: no sort, 1: ascending, 2: descending
  
  // Populate buy prices table
  populatePriceTable('buyPricesTable', 'buy', sortState);
  
  // Populate sell prices table
  populatePriceTable('sellPricesTable', 'sell', sortState);
}

// Populate a price table (buy or sell)
function populatePriceTable(tableId: string, priceType: 'buy' | 'sell', sortState: { [key: string]: number }) {
  const table = document.getElementById(tableId);
  if (!table) return;
  
  const thead = table.querySelector('thead tr');
  const tbody = table.querySelector('tbody');
  if (!thead || !tbody) return;
  
  // Clear previous content
  // Keep the first header cell (Faction)
  while (thead.children.length > 1) {
    const lastChild = thead.lastChild;
    if (lastChild) {
      thead.removeChild(lastChild);
    }
  }
  tbody.innerHTML = '';
  
  // Add commodity headers
  Object.keys(commodityRates).forEach(commodity => {
    const th = document.createElement('th');
    th.classList.add('sortable');
    th.setAttribute('data-commodity', commodity);
    
    // Create container for icon and name
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    
    // Add commodity icon
    const img = document.createElement('img');
    img.src = `./images/commodities/${commodity}.png`;
    img.alt = commodity;
    container.appendChild(img);
    
    // Add commodity name
    const span = document.createElement('span');
    span.textContent = commodity;
    container.appendChild(span);
    
    th.appendChild(container);
    
    // Add sorting functionality
    th.addEventListener('click', () => {
      const commodityKey = th.getAttribute('data-commodity') || '';
      
      // Update sort state for this commodity
      if (!sortState[commodityKey]) {
        sortState[commodityKey] = 1; // First click: ascending
      } else if (sortState[commodityKey] === 1) {
        sortState[commodityKey] = 2; // Second click: descending
      } else {
        sortState[commodityKey] = 0; // Third click: no sort
      }
      
      // Reset sort state for other commodities
      Object.keys(sortState).forEach(key => {
        if (key !== commodityKey) {
          sortState[key] = 0;
        }
      });
      
      // Update sort indicators
      const headers = table.querySelectorAll('thead th.sortable');
      headers.forEach(header => {
        header.classList.remove('sort-asc', 'sort-desc');
        const headerCommodity = header.getAttribute('data-commodity');
        if (headerCommodity && sortState[headerCommodity] === 1) {
          header.classList.add('sort-asc');
        } else if (headerCommodity && sortState[headerCommodity] === 2) {
          header.classList.add('sort-desc');
        }
      });
      
      // Re-sort and repopulate table
      populatePriceTableBody(tableId, priceType, sortState);
    });
    
    thead.appendChild(th);
  });
  
  // Populate table body initially
  populatePriceTableBody(tableId, priceType, sortState);
}

// Populate table body with price data and apply sorting
function populatePriceTableBody(tableId: string, priceType: 'buy' | 'sell', sortState: { [key: string]: number }) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  // Get all faction names
  const factionNames = Object.keys(factions);
  
  // Determine if we need to sort
  let sortedFactions = [...factionNames];
  const sortCommodity = Object.keys(sortState).find(key => sortState[key] > 0);
  
  if (sortCommodity) {
    sortedFactions.sort((a, b) => {
      const factionA = factions[a];
      const factionB = factions[b];
      
      const priceA = factionA.commodities[sortCommodity]?.[priceType] || Number.MAX_VALUE;
      const priceB = factionB.commodities[sortCommodity]?.[priceType] || Number.MAX_VALUE;
      
      if (sortState[sortCommodity] === 1) { // ascending
        return priceA - priceB;
      } else { // descending
        return priceB - priceA;
      }
    });
  }
  
  // Create a row for each faction
  sortedFactions.forEach(factionName => {
    const factionData = factions[factionName];
    
    const row = document.createElement('tr');
    
    // Add faction name cell
    const nameCell = document.createElement('td');
    
    // Create container for icon and name
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    
    // Add faction avatar
    const avatar = document.createElement('img');
    avatar.src = `./images/avatars/${factionName}.png`;
    avatar.alt = factionName;
    avatar.style.width = '24px';
    avatar.style.height = '24px';
    avatar.style.marginRight = '8px';
    container.appendChild(avatar);
    
    // Add faction name
    const nameSpan = document.createElement('span');
    nameSpan.textContent = factionName;
    container.appendChild(nameSpan);
    
    nameCell.appendChild(container);
    row.appendChild(nameCell);
    
    // Add price cells for each commodity
    Object.keys(commodityRates).forEach(commodity => {
      const cell = document.createElement('td');
      
      const commodityData = factionData.commodities[commodity];
      if (commodityData && commodityData[priceType]) {
        cell.textContent = commodityData[priceType].toFixed(2);
        
        // Highlight the cell if it's the sorted column
        if (sortState[commodity] > 0) {
          cell.style.backgroundColor = 'rgba(44, 139, 160, 0.3)';
        }
        
        // Calculate price in aluminum for color coding
        const currencyRate = commodityRates[factionData.currency];
        const priceInAluminum = commodityData[priceType] * currencyRate;
        const percentDiff = ((priceInAluminum / commodityRates[commodity]) - 1) * 100;
        
        // Set color based on whether it's buy or sell price
        const isBenefit = (priceType === 'sell') ? true : false;
        const color = getColor(percentDiff, isBenefit);
        cell.style.color = color;
      } else {
        cell.textContent = '-';
        cell.style.color = '#555';
      }
      
      row.appendChild(cell);
    });
    
    tbody.appendChild(row);
  });
}
