//import { trace, traceArr, info, infoArr, error , errorArr, setLogLevel } from "/netscript/utils/logger.js";
import * as logger from "/netscript/utils/logger.js";
import * as data from "/netscript/stock/data.js";

let functionName = "FUNC";
let symbol = "";
let logLevel = "TRACE";

export function main(ns) {
    logger.setLogLevel(logLevel);
    symbol = ns.args[0];
    
    data.setForecast(symbol, 0.5);
    data.getOrder(symbol);
    data.setForecast(symbol, 0);
    data.getOrder(symbol);
    //data.getLimits();
    
    let symbols = ns.getStockSymbols();
    
    /*logger.trace(functionName, "TRACE");
    logger.info(functionName, "INFO");
    logger.error(functionName, "ERROR");
    logger.setLogLevel("trace");
    logger.traceArr(functionName, ["TRACE", "TRACE2"]);
    //error(functionName, "ERROR");
    infoArr(functionName, ["INFO 1", "INFO 2"]);
    error(functionName, "ERROR");
    errorArr(functionName, ["ERROR 1", "ERROR 2"]);*/
}