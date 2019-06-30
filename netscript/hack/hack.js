let moneyThreshold;
let securityThreshold;
let securityLevel;
let moneyAvaiable;

export async function main(ns) {
    ns.disableLog("ALL");
    let numberOfThreads = ns.args[0];
    let target = ns.getHostname();
    while (true) {
        getServerInfo(ns, target, numberOfThreads);
        if (securityLevel > securityThreshold) {
            ns.print("[WEAKEN] Weaken server " + target + " with " + numberOfThreads + " threads.");
            let decrease = await ns.weaken(target, { threads: numberOfThreads });
            ns.print("[WEAKEN] Security level decreased with " + ns.nFormat(decrease, "0.0"));
        } else if (moneyAvaiable < moneyThreshold) {
            ns.print("[GROW] Grow server " + target + " with " + numberOfThreads + " threads.");
            let grown = await ns.grow(target, { threads: numberOfThreads });
            ns.print("[GROW] Money grown " + ns.nFormat(grown - 1, "0.0000%"));
        } else {
            ns.print("[HACK] Hacking server " + target + " with " + numberOfThreads + " threads.");
            let stolen = await ns.hack(target, { threads: numberOfThreads });
            ns.print("[HACK] Money stolen " + ns.nFormat(stolen, "$0."));
        }
    }
}

function getServerInfo(ns, server, numberOfThreads) {
    moneyThreshold = ns.getServerMaxMoney(server) * 0.99;
    moneyAvaiable = ns.getServerMoneyAvailable(server);
    securityThreshold = ns.getServerMinSecurityLevel(server) + (numberOfThreads * 0.05);
    securityLevel = ns.getServerSecurityLevel(server)
    ns.print(` - MONEY (${ns.nFormat(moneyAvaiable/moneyThreshold, "0.00%")}) CURRENT: ${ns.nFormat(moneyAvaiable, "$0.")} THREHSOLD: ${ns.nFormat(moneyThreshold, "$0.")}`);
    ns.print(` - LEFT TO THRESHOLD (${ns.nFormat(securityLevel-securityThreshold, "0.0")}) CURRENT: ${ns.nFormat(securityLevel, "0.0")} THREHSOLD: ${ns.nFormat(securityThreshold, "0.0")}`);
}