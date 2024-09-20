(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))i(l);new MutationObserver(l=>{for(const u of l)if(u.type==="childList")for(const s of u.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function e(l){const u={};return l.integrity&&(u.integrity=l.integrity),l.referrerPolicy&&(u.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?u.credentials="include":l.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function i(l){if(l.ep)return;l.ep=!0;const u=e(l);fetch(l.href,u)}})();const o={"Aquarian Colony":{currency:"Platinum",commodities:{Aluminum:{sell:.09,buy:.17},Copper:{sell:.13,buy:.24},Silver:{sell:.23,buy:.44},Titanium:{sell:.33,buy:.62},Yttrium:{sell:.56,buy:1.07},Gold:{sell:.86,buy:1.64},Uranium:{sell:.77,buy:1.47},Iridium:{sell:2.83,buy:5.4},DiBeryllium:{sell:2.67,buy:5.09},Chiralite:{sell:5.2,buy:9.91},Neutronium:{sell:6.95,buy:13.24},Etherine:{sell:9.78,buy:18.64},Xenium:{sell:14.49,buy:27.61},Adamantine:{sell:52.21,buy:99.52}}},"Asteroid Traders":{currency:"Aluminum",commodities:{Copper:{sell:1.11,buy:2.24},Silver:{sell:2.17,buy:4.37},Titanium:{sell:4.26,buy:8.6},Yttrium:{sell:4.58,buy:9.23},Gold:{sell:6.07,buy:12.25},Platinum:{sell:7.04,buy:14.2},Uranium:{sell:9.58,buy:19.32},Iridium:{sell:17.6,buy:35.51},DiBeryllium:{sell:32.87,buy:66.32},Chiralite:{sell:44.14,buy:89.06},Neutronium:{sell:63.14,buy:127.8},Etherine:{sell:102.4,buy:206.5},Xenium:{sell:191,buy:385.4},Adamantine:{sell:352,buy:710.2}}},Brogidar:{currency:"Gold",commodities:{Aluminum:{sell:.12,buy:.2},Copper:{sell:.17,buy:.26},Silver:{sell:.28,buy:.45},Titanium:{sell:.75,buy:1.19},Yttrium:{sell:.65,buy:1.02},Platinum:{sell:1.65,buy:2.6},Uranium:{sell:1.33,buy:2.09},Iridium:{sell:3.08,buy:4.86},DiBeryllium:{sell:4.48,buy:7.06},Chiralite:{sell:5.48,buy:8.63},Neutronium:{sell:9.52,buy:15.01},Etherine:{sell:13.44,buy:21.19},Xenium:{sell:19.91,buy:31.39},Adamantine:{sell:49.78,buy:78.48}}},Goryr:{currency:"Silver",commodities:{Aluminum:{sell:.28,buy:.45},Copper:{sell:.43,buy:.67},Titanium:{sell:1.59,buy:2.51},Yttrium:{sell:2.07,buy:3.26},Gold:{sell:3.45,buy:5.44},Platinum:{sell:4.09,buy:6.44},Uranium:{sell:3.66,buy:5.78},Iridium:{sell:10.07,buy:15.88},DiBeryllium:{sell:20.75,buy:32.72},Chiralite:{sell:25.58,buy:40.33},Neutronium:{sell:28.67,buy:45.2},Etherine:{sell:52.2,buy:82.3},Xenium:{sell:63.7,buy:100.4},Adamantine:{sell:144.2,buy:227.3}}},"Guild Traders":{currency:"Iridium",commodities:{Aluminum:{sell:.02,buy:.03},Copper:{sell:.05,buy:.08},Silver:{sell:.06,buy:.1},Titanium:{sell:.15,buy:.22},Yttrium:{sell:.23,buy:.35},Gold:{sell:.28,buy:.42},Platinum:{sell:.32,buy:.49},Uranium:{sell:.35,buy:.53},DiBeryllium:{sell:2.03,buy:3.08},Chiralite:{sell:2.01,buy:3.05},Neutronium:{sell:3.23,buy:4.9},Etherine:{sell:6.67,buy:10.11},Xenium:{sell:9.5,buy:14.41},Adamantine:{sell:26.24,buy:39.78}}},"Island Traders":{currency:"Silver",commodities:{Aluminum:{sell:.45,buy:.71},Copper:{sell:.45,buy:.72},Titanium:{sell:2.03,buy:3.21},Yttrium:{sell:1.84,buy:2.9},Gold:{sell:2.92,buy:4.6},Platinum:{sell:3.5,buy:5.51},Uranium:{sell:4.33,buy:6.82},Iridium:{sell:9.25,buy:14.58},DiBeryllium:{sell:14.61,buy:23.04},Chiralite:{sell:20.55,buy:32.39},Neutronium:{sell:28.67,buy:45.2},Etherine:{sell:37.04,buy:58.4},Xenium:{sell:63.7,buy:100.4},Adamantine:{sell:159.3,buy:251.1}}},Kyrnan:{currency:"Platinum",commodities:{Aluminum:{sell:.1,buy:.15},Copper:{sell:.11,buy:.16},Silver:{sell:.2,buy:.31},Titanium:{sell:.45,buy:.68},Yttrium:{sell:.89,buy:1.36},Gold:{sell:.65,buy:.99},Uranium:{sell:.81,buy:1.23},Iridium:{sell:2.38,buy:3.6},DiBeryllium:{sell:3.65,buy:5.54},Chiralite:{sell:4.47,buy:6.77},Neutronium:{sell:7.31,buy:11.08},Etherine:{sell:10.96,buy:16.62},Xenium:{sell:18.59,buy:28.19},Adamantine:{sell:51.15,buy:77.56}}},Nimion:{currency:"Gold",commodities:{Aluminum:{sell:.12,buy:.17},Copper:{sell:.23,buy:.33},Silver:{sell:.28,buy:.39},Titanium:{sell:.54,buy:.76},Yttrium:{sell:.75,buy:1.05},Platinum:{sell:.82,buy:1.16},Uranium:{sell:1.8,buy:2.54},Iridium:{sell:6.56,buy:9.23},DiBeryllium:{sell:5.43,buy:7.64},Chiralite:{sell:8.66,buy:12.17},Neutronium:{sell:9.71,buy:13.65},Etherine:{sell:14.23,buy:20.01},Xenium:{sell:21.08,buy:29.65},Adamantine:{sell:63.4,buy:89.16}}},Wiskamug:{currency:"Yttrium",commodities:{Aluminum:{sell:.1,buy:.16},Copper:{sell:.21,buy:.33},Silver:{sell:.35,buy:.53},Titanium:{sell:.73,buy:1.1},Gold:{sell:1.1,buy:1.67},Platinum:{sell:1.78,buy:2.69},Uranium:{sell:1.78,buy:2.7},Iridium:{sell:3.41,buy:5.17},DiBeryllium:{sell:5.62,buy:8.53},Chiralite:{sell:8.81,buy:13.36},Neutronium:{sell:13.72,buy:20.8},Etherine:{sell:19.99,buy:30.32},Xenium:{sell:36.02,buy:54.63},Adamantine:{sell:62.47,buy:94.72}}}},n={Aluminum:1,Copper:1.5,Silver:2.5,Titanium:5,Yttrium:6.5,Gold:8,Platinum:10,Uranium:11.5,Iridium:25,DiBeryllium:45,Chiralite:55,Neutronium:90,Etherine:135,Xenium:200,Adamantine:500};console.clear();g();function g(){const y=document.querySelector("#tradeRoutes tbody");y&&(y.innerHTML="");const t=[];for(const e in o){const i=o[e],l=n[i.currency];for(const u in o){if(e===u)continue;const s=o[u],d=n[s.currency];for(const r in n){const b=i.commodities[r],c=s.commodities[r];if(!b||!c)continue;const m=c.buy*d,a=b.sell*l,p=(a-m)/m*100;t.push({commodity:r,bestBuyFaction:e,bestBuyPrice:a,bestBuyPriceOG:b.sell,bestBuyCurrency:i.currency,bestBuyPercentage:(a/n[r]-1)*100,bestSellFaction:u,bestSellPrice:m,bestSellPriceOG:c.buy,bestSellCurrency:s.currency,bestSellPercentage:(m/n[r]-1)*100,profitPercentage:p})}}}t.sort((e,i)=>i.profitPercentage-e.profitPercentage),t.forEach(e=>{const i=e.profitPercentage>0?`+${e.profitPercentage.toFixed(2)}%`:`${e.profitPercentage.toFixed(2)}%`,l=`<tr>
        <td>${e.commodity}</td>
        
        <td class="currency" style="background-image: url('./images/commodities/${e.commodity}.png');"></td>
        <td class="empty"></td>
  
        
        <!-- Sell Info Columns -->
  
        <td>${e.bestSellFaction}</td>
        
        <td class="avatar" style="background-image: url('./images/avatars/${e.bestSellFaction}.png');"></td>
        
        <!-- <td>${e.bestSellCurrency}</td> -->
         
        
        <td class="currency" style="background-image: url('./images/commodities/${e.bestSellCurrency}.png');"></td>
        
        <td class="left-align-right">${e.bestSellPriceOG.toFixed(2)}</td>
        
        <td class="left-align-right">${e.bestSellPercentage.toFixed(0)}%</td>
        
        <td class="empty"></td>
        
        
  
        <!-- Buy Info Columns -->
        <td>${e.bestBuyFaction}</td>
        
        <td class="avatar" style="background-image: url('./images/avatars/${e.bestBuyFaction}.png');"></td>
        
        <!-- <td>${e.bestBuyCurrency}</td> -->
        
        <td class="left-align-right">${e.bestBuyPriceOG.toFixed(2)}</td>
        
        <td class="currency" style="background-image: url('./images/commodities/${e.bestBuyCurrency}.png');"></td>
        
        <td class="left-align-right">${e.bestBuyPercentage.toFixed(0)}%</td>
        
        <td class="empty"></td>
        
        
        <!-- Profit Column -->
        <td class="left-align-right">${i}</td>
     </tr>`;y?.insertAdjacentHTML("beforeend",l)})}
//# sourceMappingURL=index.js.map
