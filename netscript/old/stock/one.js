import * as stocks from "/netscript/stock/stocks.js";
import * as logger from "/netscript/utils/logger.js";

export function sellStock(ns, symbol) {
    let stock = stocks.getStock(symbol.toUpperCase());
    if (stock === undefined) {
        logger.info("SOLD", ["COULD NOT SELL STOCK", symbol.toUpperCase() + " is undefined"]);
    }
    let orderAmmount = stock.ammount;
    if (orderAmmount !== 0) {
        let price = ns.sellStock(symbol, orderAmmount)
        let profit = ns.getStockSaleGain(symbol, orderAmmount, "Long")
        updateAmmount(symbol, -orderAmmount);
        logger.infoArr("SOLD ", [
            "STOCK: " + symbol,
            "PRICE: " + ns.nFormat(price, "$0.000a"),
            "AMMOUNT: " + ns.nFormat(orderAmmount, "0.000a"),
            "PROFIT: " + ns.nFormat(profit, "$0.000a")
        ]);
    }
}

function purchaseStock(ns, symbol, orderAmmount) {
    let stepSize = Math.floor(orderAmmount / 10);
    let buyAmmount = orderAmmount + stepSize;
    let price = stocks.getPrice(symbol);
    let purchase = 0;

    while (purchase === 0 && buyAmmount > 0) {
        buyAmmount -= stepSize;
        logger.debugArr("BUY ATTEMPT", ["STOCK: " + symbol,
            "AMMOUNT: " + buyAmmount
        ]);
        purchase = ns.buyStock(symbol, buyAmmount);
    }
    if (purchase === 0) {
        logger.errorArr("ERROR COULD NOT BUY", ["STOCK: " + symbol,
            "AMMOUNT: " + ns.nFormat(orderAmmount, "0.000a"),
            "PRICE: " + ns.nFormat(price, "$0.000a"),
            "COST: " + ns.nFormat(price * orderAmmount, "$0.000a")
        ]);
    } else {
        logger.infoArr("BOUGHT", ["STOCK: " + symbol,
            "AMMOUNT: " + ns.nFormat(buyAmmount, "0.000a"),
            "PRICE: " + ns.nFormat(purchase, "$0.000a"),
            "COST: " + ns.nFormat(purchase * buyAmmount, "$0.000a")
        ]);
        updateAmmount(symbol, orderAmmount);
    }
}

function updateAmmount(symbol, orderAmmount) {
    stocks.changeAmmount(symbol, orderAmmount);
}

function updateStock(ns, symbol, buyThreshold, sellThreshold) {
    let stock = stocks.getStock(symbol);
    if (stock === undefined) {
        logger.trace("LOAD", `${symbol} does not exist in stocks, loading stock`);
        stocks.addStock(symbol,
            getForecast(ns, symbol),
            getPrice(ns, symbol),
            ns.getStockMaxShares(symbol));
    } else {
        logger.trace("UPDATE", `Updating stock ${symbol}.`);
        stocks.setForecast(symbol, getForecast(ns, symbol));
        stocks.setPrice(symbol, getPrice(ns, symbol));
    }
    return getOrder(ns, symbol, buyThreshold, sellThreshold);
}

export function getForecast(ns, symbol) {
    return Math.floor(ns.getStockForecast(symbol) * 100);
}


export function getPrice(ns, symbol) {
    return ns.getStockAskPrice(symbol);
}

export function getOrder(ns, symbol, buyThreshold, sellThreshold) {
    let stock = stocks.getStock(symbol);

    let orderAmmount = 0;
    if (stock.forecast > buyThreshold) {
        let money = ns.getServerMoneyAvailable("home");
        orderAmmount = stock.getPurchaseAmmount(money);
    } else if (stock.forecast < sellThreshold) {
        orderAmmount = -stock.ammount;
    }

    logger.debugArr("ORDER", ["SYMBOL: " + symbol,
        "FORECAST: " + stock.forecast,
        "BUY THRESHOLD: " + buyThreshold,
        "SELL THRESHOLD: " + sellThreshold,
        "ORDER AMMOUNT: " + orderAmmount
    ]);

    return orderAmmount;
}

export async function main(ns) {
    logger.info("STOCK: " + ns.args[0], "RESULT: " + runOne(ns, ns.args[0], "debug", 50, 50));
}

export function runOne(ns, symbol, logLevel, buyThreshold, sellThreshold) {
    logger.setLogLevel(logLevel);

    symbol = symbol.toUpperCase();
    logger.trace("START", "Started update for stock[" + symbol + "].");
    let orderAmmount = updateStock(ns, symbol, buyThreshold, sellThreshold);
    let order = 0;
    if (orderAmmount > 0) {
        purchaseStock(ns, symbol, orderAmmount);
        order = 1;
    } else {
        if (orderAmmount < 0) {
            sellStock(ns, symbol, -orderAmmount);
            order = -1;
        } else {
            order = 0;
        }
    }
    
    logger.traceArr("EXIT", ["FINISHED update for stock[" + symbol + "].", "ORDER: " + order]);
    return order;
}

function printStock(ns, symbol) {
    let stock = stocks.getStock(symbol);

    if (stock === undefined) {
        logger.info("ERROR", `STOCK[${symbol}] is undefined`);
    } else if (stock.ammount !== 0) {
        logger.infoArr("STOCK", ["SYMBOL: " + symbol,
            "FORECAST: " + stock.forecast,
            "PRICE: " + ns.nFormat(stock.price, "$0.000a"),
            `AMMOUNT: ${ns.nFormat(stock.ammount, "0.000a")}/${ns.nFormat(stock.maxAmmount, "0.000a")}(${ns.nFormat(stock.ammount / stock.maxAmmount, "0.0%")})`
        ]);
    }
}