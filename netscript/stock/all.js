import * as stocks from "/netscript/stock/stocks.js";
import * as threshold from "/netscript/stock/threshold.js";
import * as logger from "/netscript/utils/logger.js";
import * as one from "/netscript/stock/one.js";

const changeFactor = 1;
const logLevel = "info";

export async function main(ns) {
    logger.setLogLevel(logLevel);

    let stockSymbols = ns.getStockSymbols();
    let stockHoldings = [];

    for (let i = 0; i < 10; i++) {
        let bought = false;

        let currentThreshold = threshold.getThreshold();
        logger.info("STARTING", ["SYMBOLS LENGHT: " + stockSymbols.length,
            "  THRESHOLD BUY: " + currentThreshold.BUY,
            "  THRESHOLD SELL: " + currentThreshold.SELL
        ]);
        for (let i = 0; i < stockSymbols.length; i++) {
            let symbol = stockSymbols[i];
            logger.trace("STARTING", "STOCK: " + symbol);
            let purchase = await one.runOne(ns, symbol, logLevel, currentThreshold.BUY, currentThreshold.SELL);

            if (purchase == 1) {
                var index = stockHoldings.indexOf(symbol);
                if (index === -1) {
                    stockHoldings.push(symbol);
                }
            } else if (purchase == -1) {
                var index = stockHoldings.indexOf(symbol);
                if (index > -1) {
                    stockHoldings.splice(index, 1);
                }
            }
        }
        if (bought) {
            threshold.changeBuyThreshold(changeFactor);
        } else {
            threshold.changeBuyThreshold(-changeFactor);
        }
        if (stockHoldings.length > 0) {
            logger.infoArr("STOCKS: ", stockHoldings);
        }
        
        await ns.sleep(6000);
    }
    exitAll(ns, stockSymbols);
}

function exitAll(ns, stockSymbols) {
    for (let i = 0; i < stockSymbols.length; i++) {
        let symbol = stockSymbols[i];
        one.sellStock(ns, symbol);
    }
    logger.info("EXIT", "CLOSING SCRIPT");
}