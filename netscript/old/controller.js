import * as stocks from "/netscript/stock/stocks.js";
import * as logger from "/netscript/utils/logger.js";
import * as one from "/netscript/stock/one.js";
import * as all from "/netscript/stock/all.js";
import * as test from "/netscript/test/loopTest.js";
//import * as test from "/netscript/test/loopTest.js";

export async function main(ns) {
    let type = ns.args[0].toUpperCase();
    if (type == "STOCK") {
        let ammount = ns.args[1].toUpperCase();
        let argument = ns.args[2].toUpperCase();
        stock(ns, ammount, argument);
    } else if (type == "TEST") {
        ns.run("/netscript/test/loopTest.js", 1, ns.args[1]);
    } else {
        logger.error("ERROR", "INVALID TYPER: " + type);
    }
}

function stock(ns, ammount, argument){
    if (ammount == "ALL") {
        ns.run("/netscript/stock/all.js", 1, ns.args[1]);
    } else if(ammount == "ONE"){
        logger.info("START", "SCRIPT: '/netscript/stock/one.js'");
        
        ns.run("/netscript/stock/one.js", 1, argument, "debug", 50, 50);
    } else {
        logger.error("ERROR", "INVALID ACTION: " + argument);
    }
}