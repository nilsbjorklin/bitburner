let stocks = "/netscript/stock/stocks.js";
let search = "/netscript/hack/search.js";
let nodes = "/netscript/servers/hacknet-nodes.js";
let botnet = "/netscript/servers/botnet.js";
let home = "home";

export async function main(ns) {
    let argument = ns.args[0].toUpperCase();

    if (argument === "START") {
        let script = "ALL";
        let trace = false;

        if (ns.args.length > 1)
            script = ns.args[1].toUpperCase();

        if (script !== "ALL"
            && ns.args.length > 2
            && ns.args[2].toUpperCase() == "TRACE")
            trace = true;

        if (script == "ALL")
            ns.tprint("Starting all scripts.");

        if (script == "ALL" || script == "STOCKS") {
            ns.print("Starting stocks script.");
            await ns.run(stocks, 1, "START");
            
            if(trace)
                ns.tail(stocks, home, "START");
        }

        if (script == "ALL" || script == "SEARCH") {
            ns.print("Starting search script.");
            await ns.run(search, 1, "START");

            if(trace)
                ns.tail(search, home, "START");
        }

        if (script == "ALL" || script == "HACKNET") {
            ns.print("Starting hacknet script.");
            await ns.run(nodes, 1, "START");

            if(trace)
                ns.tail(nodes, home, "START");
        }

        if (script == "ALL" || script == "BOTNET") {
            ns.print("Starting botnet script.");
            await ns.run(botnet, 1, "START");
            
            if(trace)
            ns.tail(botnet, home, "START");
        }

        await ns.sleep(500);

        if (script == "ALL")
            ns.tprint("All scripts started.");
    } else if (argument === "STOP") {
        let script = "ALL";
        if (ns.args.length > 1)
            script = ns.args[1].toUpperCase();

        if (script == "ALL")
            ns.tprint("Stopping all scripts.");

        if (script == "ALL" || script == "STOCKS") {
            ns.print("Stopping stocks script.");
            ns.run(stocks, 1, "STOP");
        }

        if (script == "ALL" || script == "SEARCH") {
            ns.print("Stopping search script.");
            killScript(ns, search)
            ns.run(search, 1, "STOP");
        }

        if (script == "ALL" || script == "HACKNET") {
            ns.print("Stopping hacknet script.");
            killScript(ns, nodes)
        }

        if (script == "ALL" || script == "BOTNET") {
            ns.print("Stopping botnet script.");
            killScript(ns, botnet)
        }

        await ns.sleep(500);

        if (script == "ALL")
            ns.tprint("All scripts killed.");
    } else if (argument === "PRINT") {
        let script = ns.args[1].toUpperCase();

        if (script == "ALL" || script == "STOCKS") {
            ns.print("Printing stocks.");
            ns.run(stocks, 1, "PRINT");
        }

        if (script == "ALL" || script == "SERVERS") {
            ns.tprint("Printing servers.");
            if (ns.args.length === 1) {
                ns.tprint(`Running: '${search}' with arguments: 'PRINT', 'ALL'`);
                ns.run(search, 1, "PRINT");
            } else {
                ns.tprint(`Running: '${search}' with arguments: 'PRINT', '${ns.args[1]}'`);
                ns.run(search, 1, "PRINT", ns.args[1]);
            }
        }

        if (script == "ALL" || script == "BOTNET") {
            ns.print("Printing botnet.");
            ns.run(botnet, 1, "PRINT");
        }

        await ns.sleep(500);
    }
}

function killScript(ns, scriptName) {
    if (ns.scriptKill(scriptName, home)) {
        ns.tprint(`Killed script '${scriptName}'.`);
    } else {
        ns.tprint(`Failed to kill script '${scriptName}'.`);
    }
}