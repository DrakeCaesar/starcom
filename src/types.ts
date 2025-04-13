// Common types for the application
export interface CommodityRate {
  [key: string]: number;
}

export interface TradeRoute {
  commodity: string;
  bestSellFaction: string;
  bestSellPrice: number;
  bestSellPriceOG: number;
  bestSellCurrency: string;
  bestSellPercentage: number;
  bestBuyFaction: string;
  bestBuyPrice: number;
  bestBuyPriceOG: number;
  bestBuyCurrency: string;
  bestBuyPercentage: number;
  profitPercentage: number;
}

export type PriceType = "buy" | "sell";
