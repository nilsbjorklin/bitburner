import * as logger from "/netscript/utils/logger.js";

let stocks = {};

export function setPrice(symbol, price) {

    let stock = getStock(symbol);
    let oldPrice = stock.price;

    stock.setPrice(price);

    logger.traceArr("PRICE", ["OLD: " + oldPrice, "NEW: " + stock.price]);
}

export function getPrice(symbol) {
    return getStock(symbol).price;
}

export function setForecast(symbol, forecast) {

    let stock = getStock(symbol);
    let oldForecast = stock.forecast;

    stock.setForecast(forecast);

    logger.traceArr("FORECAST", ["OLD: " + oldForecast, "NEW: " + stock.forecast]);
}

export function getForecast(symbol) {
    return getStock(symbol).forecast;
}

export function changeAmmount(symbol, ammount) {
    let stock = getStock(symbol);
    stock.changeAmmount(ammount);
    logger.debugArr("CHANGE AMMOUNT", ["STOCK: " + symbol, "AMMOUNT: " + ammount]);
}

export function getAmmount(symbol) {
    return getStock(symbol).ammount;
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
        /*asArray: function() {
            return ["Symbol: " + this.symbol,
                "Forecast: " + this.forecast,
                "Price: " + this.price,
                `Ammount: ${this.ammount}/${this.maxAmmount}(${this.ammount / this.maxAmmount * 100}%)`
            ];
        },*/
        getPurchaseAmmount: function(money) {
            let ammount = Math.min(Math.floor(money / this.price) + this.ammount, this.maxAmmount - this.ammount)
            logger.debug("PURCHASE AMMOUNT", 
            ["AMMOUNT " + ammount, 
            "MONEY: " + money, 
            "CURRENT AMMOUNT: " + this.ammount,
            "MAX AMMOUNT: " + this.maxAmmount]);
            return ammount;
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
        logger.throwNewError(`Stock price(${price}) is not a number.`);
    }
    if (price < 0) {
        logger.throwNewError(`Stock price(${price}) is less than 0.`);
    }
}

function validAmmount(ammount) {
    if (isNaN(ammount)) {
        logger.throwNewError(`Stock ammount(${ammount}) is not a number.`);
    }
    if (!Number.isInteger(ammount)) {
        logger.throwNewError(`Stock ammount(${ammount}) is not an integer.`);
    }
    if (ammount < 0) {
        logger.throwNewError(`Stock ammount(${ammount}) is less than 0.`);
    }
}

function validLimit(limit) {
    if (isNaN(limit)) {
        logger.throwNewError(`Limit(${limit}) is not a number.`);
    }
    if (!Number.isInteger(limit)) {
        logger.throwNewError(`Limit(${limit}) is not an integer.`);
    }
    if (limit > 100) {
        logger.throwNewError(`Limit(${limit}) is more than 100.`);
    }
    if (limit < 0) {
        logger.throwNewError(`Limit(${limit}) is less than 0.`);
    }
}

export function printHolding(stockSymbols) {
    for (let i = 0; i < stockSymbols.length; i++) {
        let symbol = stockSymbols[i];
        let stock = getStock(symbol);
        if (stock !== undefined && stock.ammount !== 0) {
            printStock(symbol);
        }
    }
}

export function getStocks(){
    return stocks;
}
export function getStock(symbol){
    return stocks[symbol];
}