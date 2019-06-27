if (args === undefined || args.length === 0) {
    tprint("Target server must be provided as argument.");
    exit();
}

var currentServer = args.length === 0 ? getHostname() : args[0];
var targetServer = args[0];
var home = "home"
var runningServer = targetServer;
var dir = "/script/";
var unlockScript = dir + "unlock.script";
var hackScript = dir + "hack.script";

if (args.length > 1) {
    runningServer = args[1];
}


var freeRam = getFreeRam();
var scriptRam = getScriptCost()


print("[START] " + currentServer + getScriptName());

while (freeRam >= scriptRam) {
    if (!hasRootAccess(targetServer)) {
        print("Script ram: " + scriptRam);
        print(" - Server is locked, unlocking server");
        exec(unlockScript, home, 1, targetServer);

        while (isRunning(unlockScript, home, targetServer)) {}

        if (hasRootAccess(targetServer)) {
            print("Unlocked successfully.")
        } else {
            tprint("Failed to unlock server: " + targetServer + ".");
            exit();
        }
    }
    if (getHackingLevel() >= getServerRequiredHackingLevel(targetServer)) {
        scp(hackScript, runningServer)
        var threads = Math.floor(freeRam / scriptRam);

        print(" - " + vsprintf("Trying to start hack script with %s threads...", [threads, targetServer]));
        exec(hackScript, runningServer, threads, targetServer, threads);
        print(" - Hacking script started.");

        freeRam = getFreeRam();
        scriptRam = getScriptCost()

    } else {
        tprint(" - Hacking level not high enough.");
        print("[EXIT] " + currentServer + getScriptName());
        exit();
    }
}

print("[EXIT] " + currentServer + getScriptName());
exit();

function getScriptCost() {
    return getScriptRam(hackScript);
}

function getFreeRam() {
    var serverRam = getServerRam(runningServer);
    return serverRam[0] - serverRam[1];
}