var portNumber = args[0];
var fileName = args[1];
var stockSymbol = args[2].toUpperCase();

var logPort = 5;
var logFile = "orders.txt";
var limits = [];
var logger = "/script/logger.script"
var loggerFunctions = "/script/logger.js"

if (args.length < 3) {
    tprint("[ERROR] Arguments required: 3");
    tprint("[ERROR] KILLING ALL SCRIPTS.");
    killall("home");
    exit();
}

import {tprintColored} from "/netscript/logger/functions.ns";
tprintColored("red");

var ammount = 0;
var home = "home";
disableLog("ALL")
var previousForecast = 0;


run(logger, 1, logPort, stockSymbol);
logMessage("CLEAR");

while (limits[0] === undefined || limits[1] === undefined) limits = getLimits();

var maxShares = getStockMaxShares(stockSymbol);

logMessage(sprintf("INFO§START - PORT: %s - FILE: %s - LIMITS: %s/%s - MAX SHARES: %s", portNumber, fileName, limits[0], limits[1], maxShares));
var index = 0;

printLimits();
buy();
exitProgram();

while (true) {
    var foreCast = Math.floor(getStockForecast(stockSymbol) * 100);

    var newLimits = getLimits();
    if (newLimits[0] !== limits[0] || newLimits[1] !== limits[1] || previousForecast !== foreCast) {
        limits = newLimits;
        previousForecast = foreCast;
        printLimits();
    }

    if (foreCast < limits[1] && ammount !== 0) {
        sell();
        if (limits[1] > 100) {

        }
    } else if (ammount !== maxShares && foreCast >= limits[0]) {
        ammount += buy();
    }
    index++;
}

printShares();
sell();

function exitProgram() {
    tprint("EXITING PROGRAM AND LOGGER.");
    //kill(logger, home, logPort, stockSymbol);
    logMessage("EXIT");
    exit();
}

function printLimits() {
    logMessage(sprintf("LIMITS:UPDATE - LIMITS: %s/%s FORECAST: %s",
        nFormat(limits[0] / 100, "0%"),
        nFormat(limits[1] / 100, "0%"),
        nFormat(foreCast / 100, "0%")))
}

function getLimits() {
    var file = read(fileName);

    if (file !== undefined) {
        var newLimits = file.split("/");
        return newLimits;
    }
}

function getShares() {
    return sprintf("SHARES:  %s/%s (%s)",
        nFormat(ammount, "0.000a"),
        nFormat(maxShares, "0.000a"),
        nFormat(ammount / maxShares, "0.00%"));
}

function sell() {
    var profit = sellStock(stockSymbol, ammount);
    logMessage(sprintf("INFO§SALE - AMMOUNT: %s PROFIT: %s\n%s",
        nFormat(ammount, "0.000a"),
        nFormat(profit, "$0.000a"),
        getShares()));

    ammount = 0;
}

function buy() {
    var stockInfo = getStockInfo();
    var tries = 0;
    var maxTries = 5;
    while (buyStock(stockSymbol, stockInfo.shares) === 0 && tries < maxTries) {
        logMessage("INFO§Trying to buy:" + stockSymbol + "amm" + stockInfo.shares);
        stockInfo.shares = Math.floor(stockInfo.shares * 0.9);
        tries++;
    }

    if (stockInfo.shares <= 0) {
        return 0;
    }

    if (tries >= maxTries) {
        logMessage(sprintf("ERROR§AMMOUNT: PURCHASE FAILED! AMMOUNT: %s", stockInfo.shares));
        return 0;
    }
    ammount += stockInfo.shares;

    logMessage(sprintf("INFO§AMMOUNT: %s PRICE: %s COST: %s\n - %s",
        nFormat(ammount, "0.000a"),
        nFormat(stockInfo.price, "0.000a"),
        nFormat(stockInfo.price * ammount, "$0.000a"),
        getShares()));

    return stockInfo.shares;
}

function logMessage(message) {
    var formattedMessage = stockSymbol + "§" + message;
    write(logPort, formattedMessage);
}

function getStockInfo() {
    var money = getServerMoneyAvailable(home);
    var price = getStockAskPrice(stockSymbol);
    if (ammount === undefined) {
        ammount = 0;
    }
    var shares = Math.floor(Math.min(money / price, maxShares));
    return { price: price, shares: shares };
}