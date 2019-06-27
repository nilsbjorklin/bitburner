if (!purchase4SMarketDataTixApi()) {
    tprint(" - Couldn't purchase 4S Market Data Tix Api");
    exit();
}

if (!purchase4SMarketData()) {
    tprint(" - Couldn't purchase 4S Market Data");
    exit();
}

tprint("[START] Investing script.");
var lastStockIndex = null;
var log = "investing_log.txt";
clear(log);
var home = "home";
var stocks = getStockSymbols();
var stockAmmounts = [];

for (var stock in stocks) {
    stockAmmounts.push(0);
}
while (true) {
    var highestForecast = 0;
    var lastForecast = 0;
    var highestStockIndex = "";
    var money = getServerMoneyAvailable(home);

    for (var index in stocks) {
        var currentForecast = getStockForecast(stocks[index]);

        if (index === lastStockIndex) {
            lastForecast = currentForecast;
        }

        if (currentForecast > highestForecast) {
            highestStockIndex = index;
            highestForecast = currentForecast;
        }
    }
    
    if (highestForecast - lastForecast < 0.1) {
        highestStockIndex = lastStockIndex;
    } else {
        tprint("Found new best stock " + stocks[highestStockIndex]);
    }

    if (lastStockIndex !== null && stocks[lastStockIndex] != stocks[highestStockIndex]) {
        var sellAmmount = stockAmmounts[lastStockIndex];
        
        var profit = getStockSaleGain(stocks[lastStockIndex], sellAmmount, "Long");
        
        sellStock(stocks[lastStockIndex], sellAmmount, "a");
        stockAmmounts[lastStockIndex] + 0;
        write(log, "\n\nSold Stock " + stocks[lastStockIndex] + "\n", "a");
        write(log, "Profit: " + nFormat(profit, "$0.000a") + "\n", "a");
    }
    var stockPrice = getStockAskPrice(stocks[highestStockIndex]);
    var buyAmmount = Math.floor(Math.min(money / stockPrice, getStockMaxShares(stocks[highestStockIndex])));
    var stockInfo = 0;
    while (stockInfo === 0) {
        var stockInfo = buyStock(stocks[highestStockIndex], buyAmmount);

        if (stockInfo !== 0) {
            if(highestStockIndex === lastStockIndex){
                write(log, "Cost: " + nFormat(buyAmmount * stockInfo, "$0.000a"), "a");
                write(log, "Forecast: " + nFormat(highestForecast, "$0.000a"), "a");
                write(log, "   Ammount: " + buyAmmount, "a");
                write(log, "   Price: " + nFormat(stockInfo, "$0.000a") + "\n", "a");
            } else {
                write(log, "\n\nBought Stock: " + stocks[highestStockIndex] + "\n", "a");
                write(log, "Cost: " + nFormat(buyAmmount * stockInfo, "$0.000a"), "a");
                write(log, "Forecast: " + nFormat(highestForecast, "$0.000a"), "a");
                write(log, "   Ammount: " + buyAmmount, "a");
                write(log, "   Price: " + nFormat(stockInfo, "$0.000a") + "\n", "a");
            }
            stockAmmounts[highestStockIndex] += buyAmmount;
        } else {
            buyAmmount -= 1000;
        }
        if (buyAmmount < 0) {
            stockInfo = -1;
        }
    }


    lastStockIndex = highestStockIndex;
}