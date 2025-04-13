// Setup navigation between views
export function setupNavigation() {
  const tradeRoutesViewBtn = document.getElementById("tradeRoutesViewBtn");
  const commoditiesViewBtn = document.getElementById("commoditiesViewBtn");
  const priceComparisonViewBtn = document.getElementById(
    "priceComparisonViewBtn"
  );
  const tradeRoutesView = document.getElementById("tradeRoutesView");
  const commoditiesView = document.getElementById("commoditiesView");
  const priceComparisonView = document.getElementById("priceComparisonView");

  tradeRoutesViewBtn?.addEventListener("click", () => {
    tradeRoutesViewBtn.classList.add("active");
    commoditiesViewBtn?.classList.remove("active");
    priceComparisonViewBtn?.classList.remove("active");
    tradeRoutesView?.classList.add("active");
    commoditiesView?.classList.remove("active");
    priceComparisonView?.classList.remove("active");
  });

  commoditiesViewBtn?.addEventListener("click", () => {
    commoditiesViewBtn.classList.add("active");
    tradeRoutesViewBtn?.classList.remove("active");
    priceComparisonViewBtn?.classList.remove("active");
    commoditiesView?.classList.add("active");
    tradeRoutesView?.classList.remove("active");
    priceComparisonView?.classList.remove("active");
  });

  priceComparisonViewBtn?.addEventListener("click", () => {
    priceComparisonViewBtn.classList.add("active");
    tradeRoutesViewBtn?.classList.remove("active");
    commoditiesViewBtn?.classList.remove("active");
    priceComparisonView?.classList.add("active");
    tradeRoutesView?.classList.remove("active");
    commoditiesView?.classList.remove("active");
  });

  // Setup tab navigation for price comparison view
  setupPriceComparisonTabs();
}

// Setup tab navigation within the price comparison view
function setupPriceComparisonTabs() {
  const buyPricesTabBtn = document.getElementById("buyPricesTabBtn");
  const sellPricesTabBtn = document.getElementById("sellPricesTabBtn");
  const buyPricesTab = document.getElementById("buyPricesTab");
  const sellPricesTab = document.getElementById("sellPricesTab");

  buyPricesTabBtn?.addEventListener("click", () => {
    buyPricesTabBtn.classList.add("active");
    sellPricesTabBtn?.classList.remove("active");
    buyPricesTab?.classList.add("active");
    sellPricesTab?.classList.remove("active");
  });

  sellPricesTabBtn?.addEventListener("click", () => {
    sellPricesTabBtn.classList.add("active");
    buyPricesTabBtn?.classList.remove("active");
    sellPricesTab?.classList.add("active");
    buyPricesTab?.classList.remove("active");
  });
}
