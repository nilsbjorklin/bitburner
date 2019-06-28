import * as logger from "/netscript/utils/logger.js";

let stocks = {};

const buyThreshold = 65;
const sellThreshold = 50;
const changeFactor = 5;

let threshold = {
    BUY: buyThreshold,
    SELL: sellThreshold,
    asArray: function() {
        return ["SELL: " + this.SELL, "BUY: " + this.BUY];
    },
    setBuy: function(buyThreshold) {
        validLimit(buyThreshold);
        this.BUY = buyThreshold;
    },
    setSell: function(sellThreshold) {
        validLimit(sellThreshold);
        this.SELL = sellThreshold;
    },
    valid: function() {
        validLimit(this.BUY);
        validLimit(this.SELL);
    }
}

export function getOrder(ns, symbol) {
    let stock = getStock(symbol);
    threshold.valid();
    let arr = threshold.asArray();
    logger.traceArr("getOrder", ["THRESHOLD",
        "SELL:" + threshold.SELL,
        "BUY:" + threshold.BUY,
        "FORECAST: " + stock.forecast
    ]);

    if (stock.forecast > threshold.BUY) {
        return stock.getPurchaseAmmount(ns.getServerMoneyAvailable("home"));
    } else if (stock.forecast < threshold.SELL) {
        return -stock.ammount;
    } else {
        return 0;
    }
}

export async function main(ns) {
    logger.setLogLevel("debug");

    let stockSymbols = ns.getStockSymbols();
    for (let i = 0; i < 10; i++) {
        let bought = false;
        for (let i = 0; i < stockSymbols.length; i++) {
            let symbol = stockSymbols[i];
            let orderAmmount = updateStock(ns, symbol);

            if (orderAmmount > 0) {
                purchaseStock(symbol, orderAmmount);
                bought = true;
            } else if (orderAmmount < 0) {
                sellStock(symbol, orderAmmount);
            }
        }
        if (bought) {
            threshold.setBuy(threshold.BUY + changeFactor);
        } else {
            threshold.setBuy(threshold.BUY - changeFactor);
        }
        logger.debug("END", "---------------------------------");
        await ns.sleep(6000);
    }
    printHolding(stockSymbols);
}

function updateStock(ns, symbol) {
    let stock = getStock(symbol);
    if (stock === undefined) {
        logger.trace("LOAD", `${symbol} does not exist in stocks, loading stock`);
        addStock(symbol,
            getForecast(ns, symbol),
            getPrice(ns, symbol),
            ns.getStockMaxShares(symbol));
    } else {
        logger.trace("UPDATE", `Updating stock ${symbol}.`);
        setForecast(symbol, getForecast(ns, symbol));
        setPrice(symbol, getPrice(ns, symbol));
    }
    return getOrder(ns, symbol);
}

export function setForecast(symbol, forecast) {
    logger.trace("symbol: " + symbol, "forecast: " + forecast);
    let stock = getStock(symbol);
    let oldForecast = stock.forecast;

    stock.setForecast(forecast);

    logger.traceArr("FORECAST", ["OLD: " + oldForecast, "NEW: " + stock.forecast]);
}

export function setPrice(symbol, forecast) {

    let stock = getStock(symbol);
    let oldPrice = stock.price;

    stock.setPrice(forecast);

    logger.traceArr("PRICE", ["OLD: " + oldPrice, "NEW: " + stock.price]);
}

function getForecast(ns, symbol) {
    return Math.floor(ns.getStockForecast(symbol) * 100);
}


function getPrice(ns, symbol) {
    return ns.getStockPrice(symbol);
}

export function getAmmount(symbol) {
    return getStock(symbol).ammount;
}

export function setAmmount(symbol, ammount) {

    let stock = getStock(symbol);
    let oldAmmount = stock.ammount;

    stock.setAmmount(ammount);

    logger.traceArr("Ammount", ["OLD: " + oldAmmount, "NEW: " + stock.forecast]);
}

function purchaseStock(symbol, ammount) {
    let stock = getStock(symbol);
    stock.changeAmmount(ammount);
    logger.debugArr("BOUGHT", ["STOCK: " + symbol, "AMMOUNT: " + ammount]);
}

function sellStock(symbol, ammount) {
    let stock = getStock(symbol);
    stock.changeAmmount(ammount);
    logger.debugArr("SOLD", ["STOCK: " + symbol, "AMMOUNT: " + ammount]);
}
export function addStock(symbolValue, forecastValue, priceValue, ammountValue) {
    validLimit(forecastValue);
    validAmmount(ammountValue);
    logger.traceArr("Adding new stock.", ["Symbol: " + symbolValue,
        "Forecast: " + forecastValue,
        `Ammount: 0/${ammountValue}`
    ]);

    let stock = {
        symbol: symbolValue.toUpperCase(),
        forecast: forecastValue,
        price: priceValue,
        ammount: 0,
        maxAmmount: ammountValue,
        asArray: function() {
            return ["Symbol: " + this.symbol,
                "Forecast: " + this.forecast,
                "Price: " + this.price,
                `Ammount: ${this.ammount}/${this.maxAmmount}(${this.ammount/this.maxAmmount*100}%)`
            ];
        },
        getPurchaseAmmount: function(money) {
            return Math.min(Math.floor(money / this.price) + this.ammount, this.maxAmmount - this.ammount);
        },
        isValid: function() {
            validLimit(this.forecast);
            validAmmount(this.ammount);
        },
        setForecast: function(newForecast) {
            validLimit(newForecast);
            this.forecast = newForecast;
        },
        changeAmmount: function(changeAmmout) {
            validAmmount(this.ammount + changeAmmout);
            this.ammount += changeAmmout;
        },
        setPrice: function(price) {
            validPrice(price);
            this.price = price;
        }
    };
    stocks[symbolValue.toUpperCase()] = stock;
}

function validPrice(price) {
    if (isNaN(price)) {
        throwNewError(`Stock price(${price}) is not a number.`);
    }
    if (price < 0) {
        throwNewError(`Stock price(${price}) is less than 0.`);
    }
}

function validAmmount(ammount) {
    if (isNaN(ammount)) {
        throwNewError(`Stock ammount(${ammount}) is not a number.`);
    }
    if (!Number.isInteger(ammount)) {
        throwNewError(`Stock ammount(${ammount}) is not an integer.`);
    }
    if (ammount < 0) {
        throwNewError(`Stock ammount(${ammount}) is less than 0.`);
    }
}

function throwNewError(text) {
    throwNewError(text);

}

function validLimit(limit) {
    if (isNaN(limit)) {
        throwNewError(`Limit(${limit}) is not a number.`);
    }
    if (!Number.isInteger(limit)) {
        throwNewError(`Limit(${limit}) is not an integer.`);
    }
    if (limit > 100) {
        throwNewError(`Limit(${limit}) is more than 100.`);
    }
    if (limit < 0) {
        throwNewError(`Limit(${limit}) is less than 0.`);
    }
}
function printHolding(stockSymbols){
    for (let i = 0; i < stockSymbols.length; i++) {
        let symbol = stockSymbols[i];
        let stock = getStock(symbol);
        if(stock.ammount !== 0){
            printStock(symbol);
        }
    }
}
function printStock(symbol) {
    logger.infoArr("STOCK:", getStock(symbol.toUpperCase()).asArray());
}

function printThreshold() {
    logger.infoArr("THRESHOLD", threshold.asArray());
}

function getStock(symbol) {
    let stock = stocks[symbol.toUpperCase()];

    return stock;
}