var targetServer = args[0];
var portsUnlocked = 0;

if (fileExists("bruteSSH.exe")) {
    brutessh(targetServer);
    portsUnlocked++;
} else {
    print(" - bruteSSH.exe does not exist.");
}

if (fileExists("FTPCrack.exe")) {
    ftpcrack(targetServer);
    portsUnlocked++;
} else {
    print(" - FTPCrack.exe does not exist.");
}

if (fileExists("relaySMTP.exe")) {
    relaysmtp(targetServer);
    portsUnlocked++;
} else {
    print(" - relaySMTP.exe does not exist.");
}

if (fileExists("HTTPWorm.exe")) {
    httpworm(targetServer);
    portsUnlocked++;
} else {
    print(" - HTTPWorm.exe does not exist.");
}

if (fileExists("SQLInject.exe")) {
    sqlinject(targetServer);
    portsUnlocked++;
} else {
    print(" - SQLInject.exe does not exist.");
}

if (getServerNumPortsRequired(targetServer) <= portsUnlocked) {
    nuke(targetServer);
} else {
    tprint(portsUnlocked+ " ports unlocked, " + getServerNumPortsRequired(targetServer) + " ports required.");
}

if (hasRootAccess(targetServer)) {
    tprint("Root access gained for for " + targetServer);

} else {
    tprint("Failed to gain root access for " + targetServer);
}