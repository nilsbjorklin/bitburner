tprint("[START] Stock listeners.");

var monitorStock = "/script/stocks/monitorStock.script";
var monitorMarket = "/script/stocks/monitorMarket.script";
var fileName = "/data/marketValue.txt";

var portNumber = 20;

disableLog("ALL");
clear(fileName);

run(monitorMarket, 50, portNumber, fileName);

var stocks = getStockSymbols();
var startedListeners = 0;

for (var index in stocks) {
    var symbol = stocks[index];
    run(monitorStock, 1, portNumber, fileName, symbol);
    startedListeners++;
}

tprint("[EXIT] " + startedListeners + " stock listeners started.");