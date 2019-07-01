let serverList = [];
let servers = [];
let hackingLevel;
let hackScript = "/netscript/hack/hack.js";

export async function main(ns) {
  if (ns.args[0].toUpperCase() === "START") {
    hackingLevel = ns.getHackingLevel();
    let hostName = ns.getHostname();
    serverList.push(hostName);
    await findServers(ns);
    let startedServers = 0;
    let lockedServers = 0;
    let highLevelServers = 0;
    let noRamServers = 0;
    for (let i = 1; i < serverList.length; i++) addServer(ns, serverList[i]);
    for (let i = 0; i < servers.length; i++) {
      let response = await tryHack(ns, servers[i]);
      if (response === "STARTED") startedServers++;
      if (response === "LOCKED") lockedServers++;
      if (response === "HIGH_LEVEL") highLevelServers++;
      if (response === "NO_RAM") noRamServers++;
    }
    ns.tprint("STARTED SERVERS: " + startedServers);
    ns.tprint(`NOT STARTED SERVERS: ${noRamServers +
      lockedServers +
      highLevelServers}, 
            SERVER WITH NO RAM: ${noRamServers}, 
            LOCKED SERVERS: ${lockedServers}, 
            HIGH LEVEL SERVERS: ${highLevelServers}`);
  } else if (ns.args[0].toUpperCase() === "KILL") {
    killAll(ns);
  }
}

function killAll(ns) {
  for (let i = 0; i < servers.length; i++) {
    ns.tprint("KILLING SCRIPTS ON SERVER " + servers[i].serverName);
    ns.killall(servers[i].serverName);
  }
}

async function findServers(ns) {
  for (let i = 0; i < serverList.length; i++) {
    await getAdjacent(ns, serverList[i]);
  }
}

async function getAdjacent(ns, serverName) {
  let nearbyServers = ns.scan(serverName);
  for (let i = 0; i < nearbyServers.length; i++) {
    let server = nearbyServers[i];
    if (serverList.indexOf(server) === -1) {
      serverList.push(server);
    }
  }
}

function addServer(ns, serverName) {
  servers.push({
    serverName: serverName,
    hackLevel: ns.getServerRequiredHackingLevel(serverName),
    portsRequired: ns.getServerNumPortsRequired(serverName),
    rootAccess: ns.hasRootAccess(serverName),
    totalRam: ns.getServerRam(serverName)[0]
  });
}

function printAllServers(ns) {
  for (let i = 0; i < servers.length; i++) {
    printServer(ns, servers[i]);
  }
}

function printServer(ns, server) {
  ns.tprint(`SERVER: ${server.serverName}
    ROOT ACCESS: ${server.rootAccess}
    TOTAL RAM: ${server.totalRam}
    REQUIRED:
     - HACK LEVEL: ${server.hackLevel}
     - PORTS: ${server.portsRequired}`);
}

function unlock(ns, serverName) {
  ns.brutessh(serverName);
  ns.ftpcrack(serverName);
  ns.relaysmtp(serverName);
  ns.httpworm(serverName);
  ns.sqlinject(serverName);

  ns.nuke(serverName);

  return ns.hasRootAccess(serverName);
}

async function startHackScript(ns, server) {
  ns.killall(server.serverName);
  ns.scp(hackScript, ns.getHostname(), server.serverName);
  let scriptRam = ns.getScriptRam(hackScript, server.serverName);
  let threads = Math.floor(server.totalRam / scriptRam);
  if (threads > 0) {
    await ns.exec(hackScript, server.serverName, threads, threads);
    tprint(
      `STARTED '${hackScript}' WITH ${threads} THREADS ON SERVER '${
        server.serverName
      }'`
    );
  }
  return "STARTED";
}

async function tryHack(ns, server) {
  if (server.hackLevel <= hackingLevel) {
    if (ns.hasRootAccess(server.serverName)) {
      if (server.totalRam === 0) {
        ns.print("CAN'T HACK " + server.serverName + " NO RAM.");
        return "NO_RAM";
      } else {
        return await startHackScript(ns, server);
      }
    } else {
      ns.print("UNLOCKING SERVER" + server.serverName);
      if (unlock(ns, server.serverName)) {
        return await startHackScript(ns, server);
      } else {
        ns.print("COULD NOT UNLOCK SERVER" + server.serverName);
        return "LOCKED";
      }
    }
  } else {
    ns.print(
      `HACKING LEVEL NOT HIGH ENOUGH(${hackingLevel}) REQUIRED: ${
        server.hackLevel
      }`
    );
    return "HIGH_LEVEL";
  }
}

/*function printServer(ns, server) {
    let portsRequired = ns.getServerNumPortsRequired(server);
    let hackingLevelRequired = ns.getServerRequiredHackingLevel(server);
    let hackTime = ns.getHackTime(server);
    let growTime = ns.getGrowTime(server);
    let weakenTime = ns.getWeakenTime(server);
    let money = ns.getServerMoneyAvailable(server);
    let maxMoney = ns.getServerMaxMoney(server);
    let hackingLevel = ns.getHackingLevel();
    let securityLevel = ns.getServerSecurityLevel(server)
    let hackPercentage = ns.hackAnalyzePercent(server);
    ns.tprint("TRYING TO UNLOCK SERVER: " + server);
    ns.tprint(" - MONEY: " +
        ns.nFormat(money, "$00.000a") + "/" +
        ns.nFormat(maxMoney, "$00.000a") +
        " " + ns.nFormat(money / maxMoney, "0.0%"));
    ns.tprint(" - HACK PERCENTAGE: " + hackPercentage + "SECURITY LEVEL: " + securityLevel + " PORTS REQUIRED: " + portsRequired);
    ns.tprint(" - HACKING LEVEL: CURRENT: " + hackingLevel + " REQUIRED: " + hackingLevelRequired);
    ns.tprint(" - TIME: HACK: " + hackTime + " GROW: " + growTime + " WEAKEN: " + weakenTime);
}*/
