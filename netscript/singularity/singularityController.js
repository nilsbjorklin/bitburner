import { start as faction } from "/netscript/singularity/faction.js";
import { start as job } from "/netscript/singularity/job.js";
import { start as program } from "/netscript/singularity/program.js";

let home = "home";

export async function main(ns) {
    ns.disableLog("ALL");
    let argument = ns.args[0].toUpperCase();
    while (true) {
        upgradeRam(ns);

        if (argument == "FACTION") {
            faction(ns);
        } else if (argument == "JOB") {
            job(ns);
        } else if (argument == "PROGRAM") {
            program(ns);
        } else {
            program(ns);
            faction(ns);
            job(ns);
        }

        await ns.sleep(60000);
    }
}

function getServerMoneyAvailable(ns) {
    return ns.getServerMoneyAvailable(home);
}

function upgradeRam(ns) {
    ns.print("Trying to upgrade ram.");
    while (ns.getUpgradeHomeRamCost() < getServerMoneyAvailable(ns) * 0.5) {
        ns.upgradeHomeRam();
    }
}