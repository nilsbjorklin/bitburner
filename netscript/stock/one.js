//import { trace, traceArr, info, infoArr, error , errorArr, setLogLevel } from "/netscript/utils/logger.js";
import * as logger from "/netscript/utils/logger.js";

let functionName = "FUNC";

export function main(ns) {
    logger.trace(functionName, "TRACE");
    logger.info(functionName, "INFO");
    logger.error(functionName, "ERROR");
    //ns.tprint("info");
    logger.setLogLevel("trace");
    logger.traceArr(functionName, ["TRACE", "TRACE2"]);
    //error(functionName, "ERROR");
    /*infoArr(functionName, ["INFO 1", "INFO 2"]);
    error(functionName, "ERROR");
    errorArr(functionName, ["ERROR 1", "ERROR 2"]);*/
}