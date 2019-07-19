let stocks;
let sellThreshold = 0.5;
let looping = true;
export function updateStocks(ns) {
  stocks = [];
  let stockSymbols = ns.getStockSymbols();
  for (let i = 0; i < stockSymbols.length; i++) {
    let symbol = stockSymbols[i];
    addStock(ns, symbol);
  }
  stocks.sort(compareStocks);
}

export async function main(ns) {
  ns.disableLog("ALL");
  let argument = ns.args[0].toUpperCase();

  if (argument === "START") {
    ns.tprint("[STARTING INVESTMENT SCRIPT]");
    looping = true;
    let bought = 0;
    let sold = 0;
    while (looping) {
      sold += sellBadStocks(ns);
      await ns.sleep(3000);
      bought += buyStocks(ns);
      await ns.sleep(3000);
    }
    ns.print("TOTAL STOCK TRANSACTIONS: " + (bought + sold));
    sellAllStocks(ns);
    ns.tprint("[INVESTMENT SCRIPT EXITED]");
  } else if (argument === "STOP") {
    looping = false;
    ns.tprint("[STOP COMMAND CALLED]");
    sellAllStocks(ns);
  } else if (argument === "UPDATE") {
    updateStocks(ns);
  } else if (argument === "BUY") {
    buyStocks(ns);
  } else if (argument === "SELL") {
    sellBadStocks(ns);
  } else if (argument === "HOLDING") {
    printHoldings(ns);
  } else if (argument === "PRINT") {
    printAllStocks(ns);
  } else if (argument === "SELLALL") {
    sellAllStocks(ns);
  } else {
    ns.tprint("[ERROR] INVALID COMMAND: " + argument);
  }
}

function getPurchaseAmmount(ns, stock, money) {
  let commision = 100000;
  let stockPrice = ns.getStockAskPrice(stock.symbol);
  let ammount = (money - commision) / stockPrice;

  if (ammount <= 0) return 0;

  if (ammount + stock.ammount > stock.cap) return stock.cap - stock.ammount;
  return ammount;
}

function tryPurchase(ns, stock) {
  let money = ns.getServerMoneyAvailable(ns.getHostname());
  let ammount = getPurchaseAmmount(ns, stock, money);

  if (ammount !== 0) {
    let price = ns.buyStock(stock.symbol, ammount);
    if (price !== 0) {
      ns.print(
        sprintf(
          "Bought stock(%'_6s), forecast: %'05s, ammount: %'08s/%'08s (%'06s), cost:%s",
          stock.symbol,
          ns.nFormat(stock.forecast, "0.000a"),
          ns.nFormat(ammount, "0.000a"),
          ns.nFormat(stock.cap, "0.000a"),
          ns.nFormat(ammount / stock.cap, "0.0%"),
          ns.nFormat(ammount * price, "$0.000a")
        )
      );
      return 1;
    } else {
      ns.print(
        sprintf(
          "Couldn't buy stock(%'_6s), forecast: %'05s, ammount: %'08s",
          stock.symbol,
          ns.nFormat(stock.forecast, "0.000a"),
          ns.nFormat(ammount, "0.000a")
        )
      );
    }
  }
  return 0;
}

function buyStocks(ns) {
  updateStocks(ns);
  let money;
  let stocksBought = 0;
  for (let i = 0; i < stocks.length; i++) {
    let stock = stocks[i];

    stocksBought += tryPurchase(ns, stock);

    if (money < 1000000000) {
      i = stocks.length;
    }

    if (stock.forecast < 0.5) {
      ns.print(
        `STOCK Forecast to low STOCK: ${stock.symbol} FORECAST: ${
          stock.forecast
        }`
      );
      i = stocks.length;
    }
  }
  updateStocks(ns);
  return stocksBought;
}

function compareStocks(a, b) {
  const forecastA = a.forecast;
  const forecastB = b.forecast;

  let comparison = 0;

  if (forecastA > forecastB) {
    comparison = -1;
  } else if (forecastA < forecastB) {
    comparison = 1;
  }

  return comparison;
}

function sellAllStocks(ns) {
  ns.tprint("SELLING ALL STOCKS");
  updateStocks(ns);
  for (let i = 0; i < stocks.length; i++) {
    if (stocks[i].ammount !== 0) {
      sellOneStock(ns, stocks[i]);
      stocks[i].ammount = 0;
    }
  }
  ns.tprint("ALL STOCKS SOLD");
}

function sellBadStocks(ns) {
  updateStocks(ns);

  let stocksSold = 0;

  for (let i = 0; i < stocks.length; i++) {
    if (stocks[i].ammount !== 0 && stocks[i].forecast < sellThreshold) {
      sellOneStock(ns, stocks[i]);
      stocks[i].ammount = 0;
      stocksSold++;
    }
  }
  return stocksSold;
}

function sellOneStock(ns, stock) {
  ns.print(
    sprintf(
      "Sold stock(%'_6s), forecast: %'05s, ammount: %'08s/%'08s (%'06s)",
      stock.symbol,
      ns.nFormat(stock.forecast, "0.000"),
      ns.nFormat(stock.ammount, "0.000a"),
      ns.nFormat(stock.cap, "0.000a"),
      ns.nFormat(stock.ammount / stock.cap, "0.0%")
    )
  );
  ns.sellStock(stock.symbol, stock.ammount);
}

function addStock(ns, symbol) {
  stocks.push({
    symbol: symbol,
    forecast: ns.getStockForecast(symbol),
    price: ns.getStockAskPrice(symbol),
    ammount: ns.getStockPosition(symbol)[0],
    cap: ns.getStockMaxShares(symbol)
  });
}

function printAllStocks(ns) {
  ns.print("[PRINTING ALL STOCKS]");
  updateStocks(ns);
  for (let i = 0; i < stocks.length; i++) {
    if (stocks[i] !== undefined) printStock(ns, stocks[i]);
  }
  ns.print("[ALL STOCKS PRINTED]");
}

function printHoldings(ns) {
  updateStocks(ns);
  ns.print("[START HOLDINGS");
  for (let i = 0; i < stocks.length; i++) {
    if (stocks[i].ammount > 0) printStock(ns, stocks[i]);
  }
  ns.print("[EXIT HOLDINGS]");
}

function printStock(ns, stock) {
  ns.print(
    sprintf(
      "STOCK%'_6s FORECAST: %'0-5s PRICE: $%'08s AMMOUNT: %'08s/%'08s (%'05s)",
      stock.symbol,
      ns.nFormat(stock.forecast, "0.000"),
      ns.nFormat(stock.price, "0.000a"),
      ns.nFormat(stock.ammount, "0.000a"),
      ns.nFormat(stock.cap, "0.000a"),
      ns.nFormat(stock.ammount / stock.cap, "0.0%")
    )
  );
}
