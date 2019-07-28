let stocks = "/netscript/stock/stocks.js";
let search = "/netscript/hack/search.js";
let nodes = "/netscript/servers/hacknet-nodes.js";
let botnet = "/netscript/servers/botnet.js";
let singularityController = "/netscript/singularity/singularityController.js";
let job = "/netscript/singularity/job.js";
let faction = "/netscript/singularity/faction.js";
let program = "/netscript/singularity/program.js";
let home = "home";

export async function main(ns) {
    let argument = ns.args[0].toUpperCase();

    if (argument === "START") {
        let script = "ALL";
        let trace = false;

        if (ns.args.length > 1)
            script = ns.args[1].toUpperCase();

        if (script !== "ALL" &&
            ns.args.length > 2 &&
            ns.args[2].toUpperCase() == "TRACE")
            trace = true;

        if (script == "ALL")
            ns.tprint("Starting all scripts.");

        if (script == "ALL" || script == "STOCKS") {
            ns.tprint("Starting stocks script.");
            await ns.run(stocks, 1, "START");

            if (trace)
                ns.tail(stocks, home, "START");
            await ns.sleep(500);
        }

        if (script == "ALL" || script == "SEARCH") {
            ns.tprint("Starting search script.");
            await ns.run(search, 1, "START");

            if (trace)
                ns.tail(search, home, "START");
            await ns.sleep(500);
        }

        if (script == "ALL" || script == "HACKNET") {
            ns.tprint("Starting hacknet script.");
            await ns.run(nodes, 1, "START");

            if (trace)
                ns.tail(nodes, home, "START");
            await ns.sleep(500);
        }

        if (script == "ALL" || script == "BOTNET") {
            ns.tprint("Starting botnet script.");
            await ns.run(botnet, 1, "START");

            if (trace)
                ns.tail(botnet, home, "START");
            await ns.sleep(500);
        }

        if (script == "ALL" || script == "JOB") {
            ns.tprint("Starting singularity script for jobs..");
            await ns.run(singularityController, 1, "JOB");

            if (trace)
                ns.tail(job, home, "JOB");
            await ns.sleep(500);
        }

        if (script == "ALL" || script == "PROGRAM") {
            ns.tprint("Starting singularity script for programs..");
            await ns.run(singularityController, 1, "PROGRAM");

            if (trace)
                ns.tail(job, home, "PROGRAM");
            await ns.sleep(500);
        }

        if (script == "ALL" || script == "FACTION") {
            ns.tprint("Starting singularity script for factions..");
            await ns.run(singularityController, 1, "FACTION");

            if (trace)
                ns.tail(job, home, "FACTION");
            await ns.sleep(500);
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
            ns.tprint("Stopping stocks script.");
            ns.run(stocks, 1, "STOP");
        }

        if (script == "ALL" || script == "SEARCH") {
            ns.tprint("Stopping search script.");
            killScript(ns, search)
            ns.run(search, 1, "STOP");
        }

        if (script == "ALL" || script == "HACKNET") {
            ns.tprint("Stopping hacknet script.");
            killScript(ns, nodes)
        }

        if (script == "ALL" || script == "BOTNET") {
            ns.tprint("Stopping botnet script.");
            killScript(ns, botnet)
        }

        if (script == "ALL" || script == "JOB") {
            ns.tprint("Stopping job script.");
            killScript(ns, job);
        }


        if (script == "ALL" || script == "PROGRAM") {
            ns.tprint("Stopping program script.");
            killScript(ns, program);
        }


        if (script == "ALL" || script == "FACTION") {
            ns.tprint("Stopping faction script.");
            killScript(ns, faction);
        }

        if (script == "ALL" || script == "SINGULARITY") {
            ns.tprint("Stopping singularity script.");
            killScript(ns, singularityController);
        }

        await ns.sleep(500);

        if (script == "ALL")
            ns.tprint("All scripts killed.");
    } else if (argument === "PRINT") {
        let script = ns.args[1].toUpperCase();

        if (script == "ALL" || script == "STOCKS") {
            ns.tprint("Printing stocks.");
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
            ns.tprint("Printing botnet.");
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