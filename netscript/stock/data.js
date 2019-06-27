import * as logger from "/netscript/utils/logger.js";

let stocks = {};

const buyThreshold = 65;
const sellThreshold = 50;

let threshold = {
    SELL: buyThreshold,
    BUY: sellThreshold,
    asArray: function() {
        return ["SELL: " + this.SELL, "BUY: " + this.BUY];
    },
    valid: function() {
        if (Number(this.SELL) === "NaN" || this.SELL > 100 || this.SELL < 0) {
            throw new Error(`${this.SELL} is not a valid sell threshold.`);
        } else if (isNan(this.BUY) || this.BUY > 100 || this.BUY < 0) {
            throw new Error(`${this.BUY} is not a valid buy threshold.`);
        }
    }
}

export function getOrder(symbol) {
    let stock = getStock(symbol);
    threshold.valid();
    let arr = threshold.asArray();
    logger.traceArr("getOrder", ["THRESHOLD",
        "SELL:" + threshold.SELL,
        "BUY:" + threshold.BUY,
        "FORECAST: " + stock.forecast
    ]);

    if (stock.forecast > threshold.BUY) {
        logger.info("ORDER", "BUY!");
        return 1;

    } else if (stock.forecast < threshold.SELL) {
        logger.info("ORDER", "SELL!");
        return -1;
    } else {
        logger.info("ORDER", "No order");
        return 0;
    }
}
export function main(ns) {
    logger.setLogLevel("info");
    let symbol = "ECP";

    addStock(symbol, 0.7, 0);
    setForecast(symbol, 30);
    setAmmount(symbol, 1221);
    
    logger.trace("ORDER", getOrder(symbol));
    setForecast(symbol, 0.6);
    logger.trace("ORDER", getOrder(symbol));


    printStock(symbol);
}

export function setForecast(symbol, forecast) {

    let stock = getStock(symbol);
    let oldForecast = stock.forecast;

    stock.setForecast(ammount);

    logger.traceArr("FORECAST", ["OLD: " + oldForecast, "NEW: " + stock.forecast]);
}

export function getForecast(symbol) {
    return getStock(symbol).forecast;
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

export function addStock(symbolValue, forecastValue, ammountValue) {
    validForecast(forecastValue);
    validAmmount(ammountValue);
    logger.traceArr("Adding new stock.", ["Symbol: " + symbolValue,
        "Forecast: " + forecastValue,
        "Ammount: " + ammountValue
    ]);

    let stock = {
        symbol: symbolValue.toUpperCase(),
        forecast: forecastValue,
        ammount: ammountValue,
        asArray: function() {
            return ["Symbol: " + this.symbol,
                "Forecast: " + this.forecast,
                "Ammount: " + this.ammount
            ];
        },
        isValid: function() {
            validForecast(this.forecast);
            validAmmount(this.ammount);
        },
        setForecast: function(newForecast) {
            validForecast(newForecast);
            this.forecast = newForecast;
        },
        setAmmount: function(newAmmount) {
            validAmmount(newAmmount);
            this.ammount = newAmmount;
        }
    };
    stocks[symbolValue.toUpperCase()] = stock;
}

function validAmmount(ammount) {
    if (Number(ammount) === "NaN") {
        throw new Error(`Stock ammount(${forecast}) is not a number.`);
    }
    if (!Number.isInteger(ammount)) {
        throw new Error(`Stock ammount(${forecast}) is not an integer.`);
    }
    if (ammount < 0) {
        throw new Error(`Stock ammount(${forecast}) is less than 100.`);
    }
}

function validForecast(forecast) {
    if (Number(forecast) === "NaN") {
        throw new Error(`Stock forecast(${forecast}) is not a number.`);
    }
    if (!Number.isInteger(forecast)) {
        throw new Error(`Stock forecast(${forecast}) is not an integer.`);
    }
    if (forecast > 100) {
        throw new Error(`Stock forecast(${forecast}) is more than 100.`);
    }
    if (forecast < 0) {
        throw new Error(`Stock forecast(${forecast}) is less than 100.`);
    }
}

function printStock(symbol) {
    logger.info("STOCK:", getStock(symbol.toUpperCase()).asArray());
}

function printThreshold() {
    logger.infoArr("THRESHOLD", threshold.asArray());
}

function getStock(symbol) {
    let stock = stocks[symbol.toUpperCase()];

    if (stock === undefined) {
        throw new Error(`Could not get stock, ${symbol.toUpperCase()} does not exist.`);
    }

    return stock;
}