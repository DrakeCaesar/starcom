interface CommodityPrices {
  sell: number;

  buy: number;
  sellPercent?: number;
  buyPercent?: number;
}

interface Faction {
  currency: string; // Add currency here
  commodities: {
    [commodity: string]: CommodityPrices;
  };
}

interface Factions {
  [factionName: string]: Faction;
}

export const factions: Factions = {
  "Aquarian Colony": {
    currency: "Platinum",
    commodities: {
      Aluminum: { sell: 0.09, buy: 0.17 },
      Copper: { sell: 0.13, buy: 0.24 },
      Silver: { sell: 0.23, buy: 0.44 },
      Titanium: { sell: 0.33, buy: 0.62 },
      Yttrium: { sell: 0.56, buy: 1.07 },
      Gold: { sell: 0.86, buy: 1.64 },
      // Platinum is the currency
      Uranium: { sell: 0.77, buy: 1.47 },
      Iridium: { sell: 2.83, buy: 5.4 },
      DiBeryllium: { sell: 2.67, buy: 5.09 },
      Chiralite: { sell: 5.2, buy: 9.91 },
      Neutronium: { sell: 6.95, buy: 13.24 },
      Etherine: { sell: 9.78, buy: 18.64 },
      Xenium: { sell: 14.49, buy: 27.61 },
      Adamantine: { sell: 52.21, buy: 99.52 },
    },
  },
  "Asteroid Traders": {
    currency: "Aluminum",
    commodities: {
      // Aluminum is the currency
      Copper: { sell: 1.11, buy: 2.24 },
      Silver: { sell: 2.17, buy: 4.37 },
      Titanium: { sell: 4.26, buy: 8.6 },
      Yttrium: { sell: 4.58, buy: 9.23 },
      Gold: { sell: 6.07, buy: 12.25 },
      Platinum: { sell: 7.04, buy: 14.2 },
      Uranium: { sell: 9.58, buy: 19.32 },
      Iridium: { sell: 17.6, buy: 35.51 },
      DiBeryllium: { sell: 32.87, buy: 66.32 },
      Chiralite: { sell: 44.14, buy: 89.06 },
      Neutronium: { sell: 63.14, buy: 127.8 },
      Etherine: { sell: 102.4, buy: 206.5 },
      Xenium: { sell: 191.0, buy: 385.4 },
      Adamantine: { sell: 352.0, buy: 710.2 },
    },
  },
  Brogidar: {
    currency: "Gold",
    commodities: {
      Aluminum: { sell: 0.12, buy: 0.2 },
      Copper: { sell: 0.17, buy: 0.26 },
      Silver: { sell: 0.28, buy: 0.45 },
      Titanium: { sell: 0.75, buy: 1.19 },
      Yttrium: { sell: 0.65, buy: 1.02 },
      // Gold is the currency
      Platinum: { sell: 1.65, buy: 2.6 },
      Uranium: { sell: 1.33, buy: 2.09 },
      Iridium: { sell: 3.08, buy: 4.86 },
      DiBeryllium: { sell: 4.48, buy: 7.06 },
      Chiralite: { sell: 5.48, buy: 8.63 },
      Neutronium: { sell: 9.52, buy: 15.01 },
      Etherine: { sell: 13.44, buy: 21.19 },
      Xenium: { sell: 19.91, buy: 31.39 },
      Adamantine: { sell: 49.78, buy: 78.48 },
    },
  },
  Goryr: {
    currency: "Silver",
    commodities: {
      Aluminum: { sell: 0.28, buy: 0.45 },
      Copper: { sell: 0.43, buy: 0.67 },
      // Silver is the currency
      Titanium: { sell: 1.59, buy: 2.51 },
      Yttrium: { sell: 2.07, buy: 3.26 },
      Gold: { sell: 3.45, buy: 5.44 },
      Platinum: { sell: 4.09, buy: 6.44 },
      Uranium: { sell: 3.66, buy: 5.78 },
      Iridium: { sell: 10.07, buy: 15.88 },
      DiBeryllium: { sell: 20.75, buy: 32.72 },
      Chiralite: { sell: 25.58, buy: 40.33 },
      Neutronium: { sell: 28.67, buy: 45.2 },
      Etherine: { sell: 52.2, buy: 82.3 },
      Xenium: { sell: 63.7, buy: 100.4 },
      Adamantine: { sell: 144.2, buy: 227.3 },
    },
  },
  "Guild Traders": {
    currency: "Iridium",
    commodities: {
      Aluminum: { sell: 0.02, buy: 0.03 },
      Copper: { sell: 0.05, buy: 0.08 },
      Silver: { sell: 0.06, buy: 0.1 },
      Titanium: { sell: 0.15, buy: 0.22 },
      Yttrium: { sell: 0.23, buy: 0.35 },
      Gold: { sell: 0.28, buy: 0.42 },
      Platinum: { sell: 0.32, buy: 0.49 },
      Uranium: { sell: 0.35, buy: 0.53 },
      // Iridium is the currency
      DiBeryllium: { sell: 2.03, buy: 3.08 },
      Chiralite: { sell: 2.01, buy: 3.05 },
      Neutronium: { sell: 3.23, buy: 4.9 },
      Etherine: { sell: 6.67, buy: 10.11 },
      Xenium: { sell: 9.5, buy: 14.41 },
      Adamantine: { sell: 26.24, buy: 39.78 },
    },
  },
  "Island Traders": {
    currency: "Silver",
    commodities: {
      Aluminum: { sell: 0.45, buy: 0.71 },
      Copper: { sell: 0.45, buy: 0.72 },
      // Silver is the currency
      Titanium: { sell: 2.03, buy: 3.21 },
      Yttrium: { sell: 1.84, buy: 2.9 },
      Gold: { sell: 2.92, buy: 4.6 },
      Platinum: { sell: 3.5, buy: 5.51 },
      Uranium: { sell: 4.33, buy: 6.82 },
      Iridium: { sell: 9.25, buy: 14.58 },
      DiBeryllium: { sell: 14.61, buy: 23.04 },
      Chiralite: { sell: 20.55, buy: 32.39 },
      Neutronium: { sell: 28.67, buy: 45.2 },
      Etherine: { sell: 37.04, buy: 58.4 },
      Xenium: { sell: 63.7, buy: 100.4 },
      Adamantine: { sell: 159.3, buy: 251.1 },
    },
  },
  Kyrnan: {
    currency: "Platinum",
    commodities: {
      Aluminum: { sell: 0.1, buy: 0.15 },
      Copper: { sell: 0.11, buy: 0.16 },
      Silver: { sell: 0.2, buy: 0.31 },
      Titanium: { sell: 0.45, buy: 0.68 },
      Yttrium: { sell: 0.89, buy: 1.36 },
      Gold: { sell: 0.65, buy: 0.99 },
      // Platinum is the currency
      Uranium: { sell: 0.81, buy: 1.23 },
      Iridium: { sell: 2.38, buy: 3.6 },
      DiBeryllium: { sell: 3.65, buy: 5.54 },
      Chiralite: { sell: 4.47, buy: 6.77 },
      Neutronium: { sell: 7.31, buy: 11.08 },
      Etherine: { sell: 10.96, buy: 16.62 },
      Xenium: { sell: 18.59, buy: 28.19 },
      Adamantine: { sell: 51.15, buy: 77.56 },
    },
  },
  Nimion: {
    currency: "Gold",
    commodities: {
      Aluminum: { sell: 0.12, buy: 0.17 },
      Copper: { sell: 0.23, buy: 0.33 },
      Silver: { sell: 0.28, buy: 0.39 },
      Titanium: { sell: 0.54, buy: 0.76 },
      Yttrium: { sell: 0.75, buy: 1.05 },
      // Gold is the currency
      Platinum: { sell: 0.82, buy: 1.16 },
      Uranium: { sell: 1.8, buy: 2.54 },
      Iridium: { sell: 6.56, buy: 9.23 },
      DiBeryllium: { sell: 5.43, buy: 7.64 },
      Chiralite: { sell: 8.66, buy: 12.17 },
      Neutronium: { sell: 9.71, buy: 13.65 },
      Etherine: { sell: 14.23, buy: 20.01 },
      Xenium: { sell: 21.08, buy: 29.65 },
      Adamantine: { sell: 63.4, buy: 89.16 },
    },
  },
  Wiskamug: {
    currency: "Yttrium",
    commodities: {
      Aluminum: { sell: 0.1, buy: 0.16 },
      Copper: { sell: 0.21, buy: 0.33 },
      Silver: { sell: 0.35, buy: 0.53 },
      Titanium: { sell: 0.73, buy: 1.1 },
      // Yttrium is the currency
      Gold: { sell: 1.1, buy: 1.67 },
      Platinum: { sell: 1.78, buy: 2.69 },
      Uranium: { sell: 1.78, buy: 2.7 },
      Iridium: { sell: 3.41, buy: 5.17 },
      DiBeryllium: { sell: 5.62, buy: 8.53 },
      Chiralite: { sell: 8.81, buy: 13.36 },
      Neutronium: { sell: 13.72, buy: 20.8 },
      Etherine: { sell: 19.99, buy: 30.32 },
      Xenium: { sell: 36.02, buy: 54.63 },
      Adamantine: { sell: 62.47, buy: 94.72 },
    },
  },
};
