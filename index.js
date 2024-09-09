const fs = require("fs");

const trade_data = fs.readFileSync("trade_data.json", "utf8");

const data = JSON.parse(trade_data);

console.log(data);
