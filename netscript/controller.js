let stocks = "/netscript/stock/stocks.js";
let search = "/netscript/hack/search.js";
let nodes = "/netscript/servers/hacknet-nodes.js";
let botnet = "/netscript/servers/botnet.js";
let home = "home";

export async function main(ns) {
    let argument = ns.args[0].toUpperCase();

    if (argument === "TRACE-START-STOCKS") {
        ns.run(stocks, 1, "START");
        ns.tail(stocks, home, "START");
    }

    if (argument === "TRACE-START-SEARCH") {
        ns.run(search, 1, "START");
        ns.tail(search, home, "START");
    }

    if (argument === "TRACE-START-HACKNET-NODES") {
        ns.run(nodes, 1, "START");
        ns.tail(nodes, home, "START");
    }

    if (argument === "TRACE-START-BOTNET") {
        ns.run(botnet, 1, "START");
        ns.tail(botnet, home, "START");
    }

    if (argument === "PRINT-STOCKS") {
        ns.run(stocks, 1, "PRINT");
    }

    if (argument === "PRINT-SERVERS") {
        ns.tprint("Printing servers.");
        if (ns.args.length === 1) {
            ns.tprint(`Running: '${search}' with arguments: 'PRINT', 'ALL'`);
            ns.run(search, 1, "PRINT");
        } else {
            ns.tprint(`Running: '${search}' with arguments: 'PRINT', '${ns.args[1]}'`);
            ns.run(search, 1, "PRINT", ns.args[1]);
        }
    }

    if (argument === "PRINT-BOTNET") {
        ns.run(botnet, 1, "PRINT");
    }

    if (argument === "START-STOCKS") {
        ns.run(stocks, 1, "START");
    }

    if (argument === "START-SEARCH") {
        ns.run(search, 1, "START");
    }

    if (argument === "START-HACKNET-NODES") {
        ns.run(nodes, 1, "START");
    }

    if (argument === "START-BOTNET") {
        ns.run(botnet, 1, "START");
    }

    if (argument === "STOP-STOCKS") {
        ns.run(stocks, 1, "STOP");
    }

    if (argument === "STOP-SEARCH") {
        killScript(ns, search, "START")
        ns.run(search, 1, "STOP");
    }

    if (argument === "STOP-HACKNET-NODES") {
        killScript(ns, nodes, "START")
    }

    if (argument === "STOP-BOTNET") {
        killScript(ns, botnet, "START")
    }
    if (argument === "START") {
        let currentScript = ns.getScriptName();
        ns.tprint("Starting all scripts.");

        ns.run(currentScript, 1, "START-STOCKS");

        ns.run(currentScript, 1, "START-SEARCH");

        ns.run(currentScript, 1, "START-HACKNET-NODES");

        ns.run(currentScript, 1, "START-BOTNET");

        await ns.sleep(500);

        ns.tprint("All scripts started.");
    }

    if (argument === "STOP") {
        let currentScript = ns.getScriptName();

        ns.tprint("Stopping all scripts.");

        await ns.run(currentScript, 1, "STOP-STOCKS");

        ns.run(currentScript, 1, "STOP-STOCKS");

        ns.run(currentScript, 1, "STOP-SEARCH");

        ns.run(currentScript, 1, "STOP-HACKNET-NODES");

        ns.run(currentScript, 1, "STOP-BOTNET");

        await ns.sleep(500);

        ns.tprint("All scripts killed.");
    }
}

function killScript(ns, scriptName, argument) {
    if (ns.kill(scriptName, home, argument)) {
        ns.tprint(`Killed script '${botnet}' with argument '${argument}'.`);
    } else {
        ns.tprint(`Failed to kill script '${botnet}' with argument '${argument}'.`);
    }
}