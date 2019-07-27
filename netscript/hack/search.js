let serverNames = [];
let servers = [];
let programs = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"];
let home = "home";
let portPrograms;
let hackingLevel;
let hackScript = "/netscript/hack/hack.js";
let controllerScript = "/netscript/controller.js";
let backupServer;

export async function main(ns) {
    portPrograms = 0;
    for (let i = 0; i < programs.length; i++)
        if (programExists(ns, programs[i])) portPrograms++;

    ns.disableLog("ALL");
    if (ns.args[0].toUpperCase() === "START") {
        ns.tprint("[STARTING SERVER SEARCHING SCRIPT]");
        while (true) {
            servers = [];

            hackingLevel = ns.getHackingLevel();
            findServers(ns);

            //Adding servers as objects
            for (let i = 0; i < serverNames.length; i++) addServer(ns, serverNames[i]);

            //Sorting servers based on avaible money
            servers.sort(compareAvailableMoney);
            if(servers.length === 0 ){
                ns.tprint("No servers found.");
            } else {
                ns.print(" - Trying to unlock BackupServer");
                unlock(ns, servers[0])
                backupServer = servers[0];
                ns.print(" - Setting backup server: " + backupServer.name);
    
                for (let i = 0; i < servers.length; i++) {
                    startHack(ns, servers[i]);
                }
            }
            await ns.sleep(10000);
        }

        printAllServers(ns, "ALL");
        ns.tprint("[SERVER SEARCHING SCRIPT EXITED]");

    } else if (ns.args[0].toUpperCase() === "STOP") {
        killAll(ns);
    } else if (ns.args[0].toUpperCase() === "PRINT") {
        if (servers.length === 0) {
            ns.tprint("No servers exists.");
            ns.exit();
        } else {
            if (ns.args.length == 1) {
                printAllServers(ns, "ALL");
            } else {
                printAllServers(ns, ns.args[1]);
            }
        }
    } else {
        ns.tprint("INVALID ARGUMENT '" + ns.args[1].toUpperCase() + "', no such argument exists.");
    }
}

function printSummary(ns) {
    var statuses = [];

    for (let i = 0; i < stocks.length; i++) {}
    if (serverStatuses.started.total(ns) !== 0) {
        ns.tprint("Servers started.");
        if (serverStatuses.started.startedAsSelf !== 0)
            ns.tprint(` - Started regular  : ${serverStatuses.started.startedAsSelf}`);
        if (serverStatuses.started.startedAsBackup !== 0)
            ns.tprint(` - Started as backup: ${serverStatuses.started.startedAsBackup}`);
        ns.tprint(` - Started total    : ${serverStatuses.started.total(ns)}`);
    } else {
        ns.tprint("No servers started.");
    }

    if (serverStatuses.notStarted.total(ns) !== 0) {
        ns.tprint("Servers not started.");
        if (serverStatuses.notStarted.locked !== 0)
            ns.tprint(` - Locked servers   : ${serverStatuses.notStarted.locked}`);
        if (serverStatuses.notStarted.notEnoughPorts !== 0)
            ns.tprint(` - Ports required   : ${serverStatuses.notStarted.notEnoughPorts}`);
        if (serverStatuses.notStarted.noRam !== 0)
            ns.tprint(` - Due to no ram    : ${serverStatuses.notStarted.noRam}`);
        ns.tprint(` - Not started total: ${serverStatuses.notStarted.total(ns)}`);
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
    ns.tprint("KILLING SCRIPTS ON ALL SERVERS...");
    for (let i = 0; i < servers.length - 1; i++) {
        ns.print("KILLING SCRIPTS ON SERVER " + servers[i].name);
        ns.killall(servers[i].name);
    }
    ns.tprint("ALL HACKING SCRIPTS KILLED...");
}

function findServers(ns) {
    getAdjacent(ns, home);
    //addServer(ns, home);
    for (let i = 0; i < serverNames.length; i++) {
        getAdjacent(ns, serverNames[i]);
    }
}

function getAdjacent(ns, name) {
    try {
        if (exists(ns, name)) {
            let nearbyServers = ns.scan(name);
            for (let i = 0; i < nearbyServers.length; i++) {
                let server = nearbyServers[i];
                if (serverNames.indexOf(server) === -1 &&
                    server != "home") {
                    serverNames.push(server);
                }
            } 
        }
    } catch (err) {
        ns.tprint(`Could not scan servers nearby to: ${name}`);
    }
}

function exists(ns, name) {
    let serverStatus = ns.serverExists(name);
    if(!serverStatus){
        ns.print(`Server '${name}' does not exist.`);
    }
    return serverStatus;
}

function addServer(ns, name) {
    if (exists(ns, name)) {
        let maxRam = 0;
        let requiredHackingLevel = 0;
        let requiredPorts = 0;
        let maxMoney = 0;
        
        try {
            let serverRam = ns.getServerRam(name);
            if (!/$botnet.*^/.test(name) && name !== "home") {
                requiredHackingLevel = ns.getServerRequiredHackingLevel(name);
                requiredPorts = ns.getServerNumPortsRequired(name);
                maxMoney = ns.getServerMaxMoney(name);
            }
            if(name == "home"){
                maxRam = serverRam[0] - serverRam[1] - ns.getScriptRam(controllerScript);
            } else {
                maxRam = serverRam[0];
            }
        } catch (err) {
            ns.tprint("ERROR: " + err + " for server: " + name);
        }

        if (maxMoney !== 0) {
            if (requiredHackingLevel > hackingLevel) {
                maxMoney = 0;
                ns.print(`No money avaiable for '${name}' Hacking level  (${hackingLevel}/${requiredHackingLevel}).`);
            } else if (portPrograms < requiredPorts) {
                maxMoney = 0;
                ns.print(`No money avaiable for '${name}' Ports unlocked (${portPrograms}/${requiredPorts}).`);
            }
        }
        
        servers.push({
            name: name,
            started: false,
            status: "WAITING",
            threads: 0,
            maxMoney: maxMoney,
            maxRam: maxRam,
            requiredHackingLevel: requiredHackingLevel,
            requiredPorts: requiredPorts
        });
    }
}

function printAllServers(ns, type) {
    if (type.toUpperCase() === "ALL") {
        ns.tprint("Printing all servers." + servers.length);
        servers.sort(compareAlphabethical);

        for (let i = 0; i < servers.length; i++)
            printServer(ns, servers[i]);
    } else if (type.toUpperCase() === "ACTIVE") {
        ns.tprint("Printing active servers." + servers.length);
        servers.sort(compareAlphabethical);

        for (let i = 0; i < servers.length; i++)
            printActiveServer(ns, servers[i]);
    } else if (type.toUpperCase() === "THREADS") {
        let threads = 0;
        for (let i = 0; i < servers.length; i++)
            threads += printThreads(ns, servers[i]);

        ns.tprint("Total number of threads: " + threads);
    } else if (type.toUpperCase() === "MONEY") {
        ns.tprint("Printing servers by money.");
        servers.sort(compareAvailableMoney);

        for (let i = 0; i < servers.length; i++)
            printMoney(ns, servers[i]);
    } else if (type.toUpperCase() === "STARTED" || type.toUpperCase() === "STOPPED") {
        ns.tprint(`Printing ${type.toLowerCase()} servers`);
        let started = true;
        if (type.toUpperCase() === "STOPPED")
            started = false;

        for (let i = 0; i < servers.length; i++) {
            if (servers[i].started === started)
                printServer(ns, servers[i]);
        }
    } else if (type.toUpperCase() === "SUMMARY") {
        ns.tprint(" - Server summary:");
        let started = 0;
        let stopped = 0;
        for (let i = 0; i < servers.length; i++) {
            if (servers[i].started === true)
                started++
                else
                    stopped++;
        }
        ns.tprint("   - Started: " + started);
        ns.tprint("   - Stopped: " + stopped);
    } else {
        ns.tprint("Printing server " + type);
        let found = false;
        for (let i = 0; i < servers.length; i++) {
            if (servers.name == type) {
                printServer(ns, servers[i]);
                found = true;
            }
        }
        if (!found)
            ns.tprint("INVALID ARGUMENT '" + type + "', no such argument or server exists.");
    }

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

function printActiveServer(ns, server) {
    if (server.threads !== 0)
        ns.tprint(`Server name: ${server.name}
        Status: ${server.status}
        Threads running: ${server.threads}
        Max money: ${server.maxMoney}
        Total ram: ${server.maxRam}
        Required Hack level: ${server.requiredHackingLevel}`);
}

function printServer(ns, server) {
    ns.tprint(`Server name: ${server.name}
        Status: ${server.status}
        Threads running: ${server.threads}
        Max money: ${server.maxMoney}
        Total ram: ${server.maxRam}
        Required Hack level: ${server.requiredHackingLevel}`);
}

function programExists(ns, program) {
    return ns.fileExists(program);
}

function unlock(ns, server) {
    if (portPrograms < server.requiredPorts) {
        setNotStarted(server, `${server.requiredPorts - portPrograms} more ports needs to be unlocked`);
        return false;
    } else {
        ns.print(`Trying to unlock server '${server.name}'`);
    }
    
    try { ns.brutessh(server.name); } catch (err) {}
    try { ns.ftpcrack(server.name); } catch (err) {}
    try { ns.relaysmtp(server.name); } catch (err) {}
    try { ns.httpworm(server.name); } catch (err) {}
    try { ns.sqlinject(server.name); } catch (err) {}
    
    ns.nuke(server.name);
    if (ns.hasRootAccess(server.name)) {
        return true;
    } else {
        setNotStarted(server, `Could not be unlocked for unknown reason.`);
        return false;
    }
}

function setStarted(server, target) {
    server.started = true;
    server.status = `Started(Hacking ${target})`;
}

function setNotStarted(server, reason) {
    server.status = `Not started(${reason})`;
}

function startHackCurrent(ns, server) {
    let scriptRam = ns.getScriptRam(hackScript, server.name);
    let threads = Math.floor(server.maxRam / scriptRam);
    if (!ns.isRunning(hackScript, server.name, threads, server.name)) {
        ns.killall(server.name);
        ns.scp(hackScript, ns.getHostname(), server.name);
        if (threads > 0) {
            ns.exec(hackScript, server.name, threads, threads, server.name);
            ns.print(` * Started hacking current server`);
            ns.print(` - Running on server: '${server.name}'`);
            ns.print(` - Number of threads: ${threads}`);
            server.threads += threads;
        }
        setStarted(server, server.name);
    }
}

function startHackBackup(ns, server) {
    let scriptRam = ns.getScriptRam(hackScript, server.name);
    let threads = Math.floor(server.maxRam / scriptRam);
    if (!ns.isRunning(hackScript, server.name, threads, backupServer.name)) {
        if(server.name !== "home"){
            ns.killall(server.name);
            ns.scp(hackScript, ns.getHostname(), server.name);
        } else {
            ns.kill();
        }
        if (threads > 0) {
            ns.exec(hackScript, server.name, threads, threads, backupServer.name);
            ns.print(` * Started hacking backup server`);
            ns.print(` - Running on server: '${server.name}'`);
            ns.print(` - Hacking: '${backupServer.name}'`);
            ns.print(` - Number of threads: ${threads}`);
            server.threads += threads;
            setStarted(server, backupServer.name);
        }
    }
}

function startHack(ns, server) {
    if (exists(ns, server.name)) {
        if (server.maxRam === 0) {
            setNotStarted(server, `Has no RAM`);
        } else if (unlock(ns, server)) {
            if (server.maxMoney === 0) {
                startHackBackup(ns, server);
            } else {
                startHackCurrent(ns, server);
            }
        }
    }
}