import * as logger from "/netscript/utils/logger.js";

let stocks ={
    ECP: {
        forecast: 0.7
    }
}

let threshold = {
    SELL: 0.5,
    BUY: 0.65
}

export function checkStock(symbol){
    let stock = stocks[symbol];
    logger.info("FORECAST: "+ stock.forecast);
    logger.info("BUY:" + threshold.BUY);
    logger.info("SELL:" + threshold.SELL);
    
}