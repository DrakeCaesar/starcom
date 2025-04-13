import { setupNavigation } from "./navigation";
import "./styles.scss";
import { CommodityRate } from "./types";
import { populateCommodityTable } from "./views/commoditiesView";
import { setupPriceComparisonView } from "./views/priceComparisonView";
import { recommendTradeRoutes } from "./views/tradeRoutesView";

// Commodities and conversion rates (Aluminum = 1.0)
const commodityRates: CommodityRate = {
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
document.addEventListener("DOMContentLoaded", () => {
  // Setup navigation between views
  setupNavigation();

  // Initialize all views
  populateCommodityTable(commodityRates);
  setupPriceComparisonView(commodityRates);
  recommendTradeRoutes(commodityRates);
});
