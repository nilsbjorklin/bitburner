//import * as logger from "/netscript/utils/logger.js";

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
}

export async function main(ns) {
    ns.disableLog("ALL");
    let argument = ns.args[0].toUpperCase();
    ns.tprint("START SCRIPT: " + ns.getScriptName(), "ARGUMENT: " + argument);
    
    if (argument === "START") {
        looping = true;
        while (looping) {
            sellBadStocks(ns);
            await ns.sleep(3000);
            buyStocks(ns);
            await ns.sleep(3000);
        }
        ns.tprint("EXIT LOOP STOPPED");
        sellAllStocks(ns);
    } else if (argument === "STOP") {
        looping = false;
        ns.tprint("EXIT STOP COMMAND CALLED, looping: " + looping)
    } else if (argument === "UPDATE")
        updateStocks(ns);
    else if (argument === "BUY")
        buyStocks(ns);
    else if (argument === "SELL")
        sellBadStocks(ns);
    else if (argument === "SELLALL")
        sellAllStocks(ns);
    else
        ns.tprint("[ERROR] INVALID COMMAND: " + argument);


}

function buyStocks(ns) {
    updateStocks(ns);
    stocks.sort(compareStocks);
    let money;
    for (let i = 0; i < stocks.length; i++) {
        let stock = stocks[i];
        money = ns.getServerMoneyAvailable(ns.getHostname());

        let ammount = Math.floor(money / ns.getStockAskPrice(stock.symbol));
        if (ammount + stock.ammount > stock.cap) {
            ammount = stock.cap - stock.ammount;
        }
        if (ammount !== 0) {
            let price = ns.buyStock(stock.symbol, ammount);
            if (price !== 0) {
                ns.print(sprintf("BOUGHT STOCK: %5s AMMOUNT: %24s COST: %s",
                        stock.symbol,
                        `${ns.nFormat(ammount, "0.000a")}/${ns.nFormat(stocks[i].cap, "0.000a")}(${ns.nFormat(ammount/stocks[i].cap, "0.0%")})`,
                        ns.nFormat(ammount * price, "$0.000a")));
            } else {
                ns.tprint(sprintf("COULD NOT BUY STOCK: %s AMMOUNT: %s COST: %s",
                        stock.symbol,
                        ns.nFormat(ammount, "0.000a"),
                        ns.nFormat(ammount * price, "$0.000a")));
            }
        }
        if (money < 1000000000) {
            i = stocks.length;
        }

        if (stock.forecast < 0.5) {
            ns.print(`STOCK Forecast to low STOCK: ${stock.symbol} FORECAST: ${stock.forecast}`);
            i = stocks.length;
        }
    }
    updateStocks(ns);
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
    updateStocks(ns);
    ns.tprint("SELLING ALL STOCKS");
    for (let i = 0; i < stocks.length; i++) {
        if (stocks[i].ammount !== 0) {
            sellOneStock(ns, stocks[i]);
            stocks[i].ammount = 0;
        }
    }
}

function sellBadStocks(ns) {
    updateStocks(ns);
    for (let i = 0; i < stocks.length; i++) {
        if (stocks[i].ammount !== 0 && stocks[i].forecast < sellThreshold) {
            ns.sellStock(stocks[i].symbol, stocks[i].ammount);
            sellOneStock(ns, stocks[i]);
            stocks[i].ammount = 0;
        }
    }
}

function sellOneStock(ns, stock) {
    ns.sellStock(stock.symbol, stock.ammount);
    ns.print("SOLD STOCK: " + stock.symbol);
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
    for (let i = 0; i < stocks.length; i++) {
        if (stocks[i] !== undefined)
            printStock(ns, stocks[i]);
    }
}

function printHoldings(ns) {
    for (let i = 0; i < stocks.length; i++) {
        if (stocks[i].ammount > 0)
            ns.print("HOLDING", [
                "SYMBOL: " + stocks[i].symbol,
                `AMMOUNT: ${ns.nFormat(stocks[i].ammount, "0.000a")}/${ns.nFormat(stocks[i].cap, "0.000a")}(${ns.nFormat(stocks[i].ammount/stocks[i].cap, "0.0%")})`
            ]);
    }
}

function printStock(ns, stock) {
    ns.print("STOCK", [
        "SYMBOL: " + stock.symbol,
        "FORECAST: " + stock.forecast,
        "PRICE: " + ns.nFormat(stock.price, "$0.000a"),
        "AMMOUNT: " + ns.nFormat(stock.ammount, "0.000a"),
        "CAP: " + ns.nFormat(stock.cap, "0.000a"),
    ]);
}