let serverNames = [];
let servers = [];
let hackingLevel;
let hackScript = "/netscript/hack/hack.js";
let backupServer;


let serverStatuses = {
    started = {
        startedAsSelf: 0,
        startedAsBackup: 0,
        total: function () {
            return startedAsSelf + startedAsBackup;
        }
    }, notStarted = {
        notEnoughPorts: 0,
        locked: 0,
        noRam: 0,
        total: function () {
            return dueToRam + dueToPorts + dueToRam;
        }
    }
}

export async function main(ns) {
    ns.disableLog("ALL");
    if (ns.args[0].toUpperCase() === "START") {
        hackingLevel = ns.getHackingLevel();
        let hostName = ns.getHostname();
        serverNames.push(hostName);
        await findServers(ns);

        //Adding servers as objects
        for (let i = 1; i < serverNames.length; i++) addServer(ns, serverNames[i]);

        //Sorting servers based on avaible money
        servers.sort(compareAvailableMoney);
        backupServer = servers[0];
        ns.print("Setting backup server to " + backupServer.name);

        let serverStatuses = [0, 0, 0, 0, 0];

        await ns.sleep(500);
        for (let i = 0; i < servers.length; i++) {
            let response = await tryHack(ns, servers[i]);
            if (response === "STARTED") serverStatuses.started.startedAsSelf++;
            if (response === "BACKUP") serverStatuses.started.startedAsBackup++;
            if (response === "PORTS") serverStatuses.notStarted.notEnoughPorts++;
            if (response === "LOCKED") serverStatuses.notStarted.locked++;
            if (response === "NO RAM") serverStatuses.notStarted.noRam++;
        }

        printSummary(ns);


    } else if (ns.args[0].toUpperCase() === "KILL") {
        killAll(ns);
    } else if (ns.args[0].toUpperCase() === "PRINT") {
        if (servers.length == 0) {
            ns.tprint("No servers exists.");
            ns.exit();
        } else {
            if (ns.args.length == 1 || ns.args[1].toUpperCase() === "ALL") {
                ns.tprint("Printing all servers.");
                servers.sort(compareAlphabethical);
                printAllServers(ns, "ALL");
            } else if (ns.args[1].toUpperCase() === "MONEY") {
                ns.tprint("Printing servers by money.");
                servers.sort(compareAvailableMoney);
                printAllServers(ns, "MONEY");
            } else if (ns.args[1].toUpperCase() === "THREADS") {
                ns.tprint("Printing servers by threads.");
                servers.sort(compareThreads);
                printAllServers(ns, "THREADS");
            } else {
                for (let i = 0; i < servers.length; i++) {
                    if (servers.name == ns.args[1])
                        ns.print("FOUND");
                    ns.print(`Trying to unlock server '${server.name}' status=${ns.unlock(ns, server)}`);
                    startHack(ns, server)
                    ns.exit();
                }
                ns.tprint(`Server '${ns.args[1]}' not found.`);
            }
        }
    } else {
        ns.tprint("INVALID ARGUMENT '" + ns.args[1].toUpperCase() + "', no such argument exists.");
    }
}

function printSummary(ns) {
    if (serverStatuses.started.total() !== 0) {
        ns.tprint("Servers started.");
        if (serverStatuses.started.startedAsSelf !== 0)
            ns.tprint(` - Started regular  : ${serverStatuses.started.startedAsSelf}`);
        if (serverStatuses.started.startedAsBackup !== 0)
            ns.tprint(` - Started as backup: ${serverStatuses.started.startedAsBackup}`);
        ns.tprint(` - Started total    : ${serverStatuses.started.total()}`);
    } else {
        ns.tprint("No servers started.");
    }

    if (serverStatuses.notStarted.total() !== 0) {
        ns.tprint("Servers not started.");
        if (serverStatuses.notStarted.locked !== 0)
            ns.tprint(` - Locked servers   : ${serverStatuses.notStarted.locked}`);
        if (serverStatuses.notStarted.notEnoughPorts !== 0)
            ns.tprint(` - Ports required   : ${serverStatuses.notStarted.notEnoughPorts}`);
        if (serverStatuses.notStarted.noRam !== 0)
            ns.tprint(` - Due to no ram    : ${serverStatuses.notStarted.noRam}`);
        ns.tprint(` - Not started total: ${serverStatuses.notStarted.total()}`);
    } else {
        ns.tprint("No servers that couldn't be started.");
    }
}

function compareThreads(a, b) {
    const threadsA = a.threads;
    const threadsB = b.threads;

    let comparison = 0;

    if (threadsA > threadsB) {
        comparison = -1;
    } else if (threadsA < threadsB) {
        comparison = 1;
    }

    return comparison;
}

function compareAlphabethical(a, b) {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    let comparison = 0;

    if (nameA < nameB) {
        comparison = -1;
    } else if (nameA > nameB) {
        comparison = 1;
    }

    return comparison;
}

function compareAvailableMoney(a, b) {
    const maxMoneyA = a.maxMoney;
    const maxMoneyB = b.maxMoney;

    let comparison = 0;

    if (maxMoneyA > maxMoneyB) {
        comparison = -1;
    } else if (maxMoneyA < maxMoneyB) {
        comparison = 1;
    }

    return comparison;
}

function killAll(ns) {
    for (let i = 0; i < servers.length; i++) {
        ns.tprint(
            "KILLING SCRIPTS ON SERVER " + servers[i].name
        );
        ns.killall(servers[i].name);
    }
}

async function findServers(ns) {
    for (let i = 0; i < serverNames.length; i++) {
        await getAdjacent(ns, serverNames[i]);
    }
}

async function getAdjacent(ns, name) {
    let nearbyServers = ns.scan(name);
    for (let i = 0; i < nearbyServers.length; i++) {
        let server = nearbyServers[i];
        if (serverNames.indexOf(server) === -1) {
            serverNames.push(server);
        }
    }
}

function addServer(ns, name) {
    let requiredHackingLevel = ns.getServerRequiredHackingLevel(name);
    let maxMoney = ns.getServerMaxMoney(name);

    if (requiredHackingLevel > hackingLevel) {
        maxMoney = 0;
    }

    servers.push({
        name: name,
        threads: 0,
        maxMoney: maxMoney,
        maxRam: ns.getServerRam(name)[0],
        requiredHackingLevel: requiredHackingLevel,
        requiredPorts: ns.getServerNumrequiredPorts(name)

    });
}

function printAllServers(ns, type) {
    let threads = 0;
    for (let i = 0; i < servers.length; i++) {
        if (type === "ALL")
            printServer(ns, servers[i]);
        else if (type === "THREADS") {
            threads += printThreads(ns, servers[i]);
        } else if (type === "MONEY") {
            printMoney(ns, servers[i]);
        }
    }
    if (type === "THREADS")
        ns.tprint("Total number of threads: " + threads);

}

function printThreads(ns, server) {
    if (server.threads != 0)
        ns.tprint(`Server name: ${server.name}, active threads: ${server.threads}, hacking level: ${server.requiredHackingLevel}`);
    return server.threads;
}

function printMoney(ns, server) {
    if (server.maxMoney != 0)
        ns.tprint(`Server name: ${server.name}, max money: ${server.maxMoney}`);
}

function printServer(ns, server) {
    ns.tprint(`Server name: ${server.name}
    Max money: ${server.maxMoney}
    Total ram: ${server.maxRam}
    Required Hack level: ${server.requiredHackingLevel}`);
}

function unlock(ns, server) {
    let portsUnlocked = 0;
    if (ns.fileExists("BruteSSH.exe")) {
        ns.brutessh(server.name);
        portsUnlocked++;
    } else {
        ns.print("BruteSSH.exe doesn't exist");
    }

    if (ns.fileExists("FTPCrack.exe")) {
        ns.ftpcrack(server.name);
        portsUnlocked++;
    } else {
        ns.print("FTPCrack.exe doesn't exist");
    }

    if (ns.fileExists("relaySMTP.exe")) {
        ns.relaysmtp(server.name);
        portsUnlocked++;
    } else {
        ns.print("relaySMTP.exe doesn't exist");
    }

    if (ns.fileExists("HTTPWorm.exe")) {
        ns.httpworm(server.name);
        portsUnlocked++;
    } else {
        ns.print("HTTPWorm.exe doesn't exist");
    }

    if (ns.fileExists("SQLInject.exe")) {
        ns.sqlinject(server.name);
        portsUnlocked++;
    } else {
        ns.print("SQLInject.exe doesn't exist");
    }

    if (portsUnlocked >= server.requiredPorts) {
        ns.nuke(server.name);
    } else {
        ns.print(server.name + " PORTS UNLOCKED: " + portsUnlocked + " REQUIRED: " + server.requiredPorts);
        return "PORTS";
    }
    if (ns.hasRootAccess(server.name)) {
        return "UNLOCKED";
    }
    return "LOCKED";
}

async function startHackCurrent(ns, server) {
    ns.killall(server.name);
    ns.scp(hackScript, ns.getHostname(), server.name);
    let scriptRam = ns.getScriptRam(hackScript, server.name);
    let threads = Math.floor(server.maxRam / scriptRam);
    if (threads > 0) {
        await ns.exec(hackScript, server.name, threads, threads, server.name);
        ns.print(`Started hacking ${server.name} with ${threads}`);
        server.threads += threads;
    }
    return "STARTED";
}

async function startHackBackup(ns, server, reason) {
    ns.killall(server.name);
    ns.scp(hackScript, ns.getHostname(), server.name);
    let scriptRam = ns.getScriptRam(hackScript, server.name);
    let threads = Math.floor(server.maxRam / scriptRam);
    if (threads > 0) {
        await ns.exec(hackScript, server.name, threads, threads, backupServer.name);
        ns.print(`${reason}, Started hacking ${backupServer.name} from ${server.name} with ${threads}`);
        backupServer.threads += threads;
    }
    return "BACKUP";
}

async function startHack(ns, server) {
    if (server.maxRam === 0) {
        ns.print("Can't stat hack script, " + server.name + " has no ram.");
        return "NO RAM";
    } else if (server.maxMoney === 0) {
        return await startHackBackup(ns, server, "No avaiable money on server " + server.name);
    } else {
        return await startHackCurrent(ns, server);
    }
}

async function tryHack(ns, server) {
    let status = unlock(ns, server)
    if (status == "UNLOCKED") {
        return await startHack(ns, server);
    }
    return status;

}