import * as threshold from "/netscript/stock/threshold.js";
import * as logger from "/netscript/utils/logger.js";
import * as one from "/netscript/stock/one.js";

const changeFactor = 5;
const logLevel = "info";
let argument;

export async function main(ns) {
    let stockSymbols = ns.getStockSymbols();
    logger.infoArr("ARGS", ns.args);
    argument = ns.args[0];
    if (argument === 0) {
        logger.info("STOPPING", ["SCRIPT: '/netscript/stock/all.js'", "ARGUMENT: " + argument]);
    } else if (argument === 1) {
        logger.setLogLevel(logLevel);
        
        let stockHoldings = [];
        let timesBought = 0;
        let timesSold = 0;
        while (argument === 1) {
            let bought = false;

            let currentThreshold = threshold.getThreshold();
            logger.info("STARTING", ["SYMBOLS LENGHT: " + stockSymbols.length,
                "  THRESHOLD BUY: " + currentThreshold.BUY,
                "  THRESHOLD SELL: " + currentThreshold.SELL,
                "  ARGUMENT: " + argument

            ]);
            for (let i = 0; i < stockSymbols.length; i++) {
                let symbol = stockSymbols[i];
                logger.trace("STARTING", "STOCK: " + symbol);
                let purchase = one.startScript(ns, symbol, logLevel, currentThreshold.BUY, currentThreshold.SELL);
                if (isNaN(purchase)) {
                    logger.error("ERROR", ["Got invalid response from 'one' script",
                        "Response: " + purchase
                    ]);
                    exitAll(ns, stockSymbols);
                }
                if (purchase > 1) {
                    var index = stockHoldings.indexOf(symbol);
                    if (index === -1) {
                        stockHoldings.push(symbol);
                        timesBought++;
                    }
                    bought = true;
                } else if (purchase < 0) {
                    var remove = stockHoldings.indexOf(symbol);
                    if (remove > -1) {
                        stockHoldings.splice(remove, 1);
                        timesSold++;
                    }
                }
            }
            if (stockHoldings.length > 0) {
                logger.infoArr("STOCKS: ", [
                    "OWNED: " + stockHoldings.length,
                    "BOUGHT: " + timesBought,
                    "SOLD: " + timesSold
                ]);
            }
            if (bought) {
                threshold.changeBuyThreshold(changeFactor);
            } else {
                threshold.changeBuyThreshold(-changeFactor);
            }

            await ns.sleep(25000);
        }
    } else {
        logger.info("ERROR", "INVALID ARGUMENT: " + argument);
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