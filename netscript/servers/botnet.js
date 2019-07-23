let home = "home";
let threshold = 0.1;

export async function main(ns) {
    ns.disableLog("ALL");

    if (ns.args[0].toUpperCase() === "START") {
        while (true) {
            let maxServerRam = maxServer(ns, 0);
            buyNewServer(ns, maxServerRam);
            await ns.sleep(10000);
        }
    } else if (ns.args[0].toUpperCase() === "PRINT") {
        printServers(ns);
    }
}

function buyNewServer(ns, maxServerRam) {
    if(maxServerRam <= getServerMaxRam(ns) && maxServerRam > 0){
        ns.print(`Trying to buy server with ${maxServerRam}GB ram.`);
        
        if (getServerLimit(ns) !== getServers(ns).length ||
            deleteSmallServers(ns, maxServerRam) > 0) {
            let purchasedServer = ns.purchaseServer(`botnet-${maxServerRam}GB`, maxServerRam);
            ns.tprint("Bought server: " + purchasedServer);
        } else {
            ns.print(`Server not bought, already at server limit with larger servers.`);
        }
    } else {
        ns.print("Invalid ram: " + maxServerRam);
    }
}

function deleteSmallServers(ns, threshold) {
    let servers = getServers(ns);
    let serversDeleted = [];
    ns.print("Deleting servers with less ram than:" + threshold);
    for (let i = 0; i < servers.length; i++) {
        let currentServer = servers[i];
        let currentServerRam = ns.getServerRam(currentServer)[0];
        if (threshold > currentServerRam) {
            ns.print(`Found server to delete '${currentServer}' with ${currentServerRam}GB ram.`);
            ns.killall(currentServer);
            if (ns.deleteServer(currentServer)) {
                serversDeleted.push(currentServer);
                ns.print(`Sold server '${currentServer}' with ${currentServerRam}GB ram.`);
            }
        } else {
            ns.print(`Not deleting server '${currentServer}' with ${currentServerRam}GB ram.`);
        }
    }

    ns.print(`${serversDeleted.length} servers deleted: `);

    for (let i = 0; i < serversDeleted.length; i++) {
        ns.print(serversDeleted[i]);
    }
    return serversDeleted.length;
}

function getServers(ns) {
    return ns.getPurchasedServers(true);
}

function getServerLimit(ns) {
    return ns.getPurchasedServerLimit();
}

function printServers(ns) {
    let servers = getServers(ns);
    let serverString = `\n Servers owned: ${servers.length}/${getServerLimit(ns)}:`;

    for (let i = 0; i < servers.length; i++) {
        serverString += `\n - ${servers[i]}, RAM: ${ns.getServerRam(servers[i])[0]}GB/${ns.nFormat(ns.getPurchasedServerMaxRam(servers[i]), "0")}GB`;
    }
    ns.tprint(serverString);
}

function maxServer(ns, ram) {
    let newRam = ram * 2;
    if (newRam === 0) {
        newRam = 2;
    }

    if (getServerMaxRam(ns) >= newRam) {
        let ramCost = ns.getPurchasedServerCost(newRam);
        if (checkMoney(ns) > ramCost) {
            return maxServer(ns, newRam);
        }
    }
    ns.print(`Max ram for purchase: ${ns.nFormat(ram, "0")}GB`);
    return ram;
}

function getServerMaxRam(ns){
    return ns.getPurchasedServerMaxRam();
}

function checkMoney(ns) {
    return ns.getServerMoneyAvailable(home) * threshold;
}