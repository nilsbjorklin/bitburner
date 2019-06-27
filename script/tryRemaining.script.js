var hackedPort = 1;
var remainingPort = 2;


var home = "home";
var dir = "/script/";

var stopScript = dir + "killHacks.script";
var netstatListener = dir + "listenToPort.script";
var hackScript = dir + "hack.script";
var startScript = dir + "runHacks.script";

var hackedFilename = "active.txt";
var remainingFilename = "remaining.txt";
var currentHackingLevel = getHackingLevel();

var hackedServers = read(hackedFilename).split("\n");
var remainingServers = read(remainingFilename).split("\n");
tprint("Rows in files, active: " + hackedServers.length + ", remaining: " + remainingFilename.length);

var timeoutLimit = 50,
    startedServer = 0,
    alreadyStarted = 0,
    couldNotBeStarted = 0;

run(netstatListener, 1, hackedPort, hackedFilename);
run(netstatListener, 1, remainingPort, remainingFilename);


tprint("[START] Adding active servers.");

for (var index in hackedServers) {
    var node = hackedServers[index];
    if (node.length !== 0) {
        alreadyStarted++;
        tryWrite(hackedPort, node);
    }
}

tprint(" * Trying to hack remaining.");

for (var index in remainingServers) {
    var server = remainingServers[index].split("PORT:");
    var node = server[0];
    var port = server[1];
    if (port > currentHackingLevel) {
        tprint(" - Hacking level to low for server '" + node + "', " + port + " required.");
    }
    if (node.length !== 0 && getServerRam(node) >= getScriptRam(startScript, home)) {
        tprint(" * Trying to hack " + node + "...");

        var iterationCount = 0;

        while (!scriptRunning(hackScript, node) && iterationCount <= timeoutLimit) {
            if (iterationCount === 0) {
                exec(startScript, home, 1, node);
            }
            iterationCount++;
        }
        if (iterationCount >= timeoutLimit) {
            tprint(" - Could not hack " + node);
            couldNotBeStarted++;
            tryWrite(remainingPort, node + "PORT:" + getServerRequiredHackingLevel(node));
        } else if (iterationCount !== 0) {
            tprint(" - " + node + " is now hacked.");
            startedServer++;
            tryWrite(hackedPort, node);
        } else {
            tprint(" - " + node + " is already hacked.");
            alreadyStarted++;
            tryWrite(hackedPort, node);
        }
    }
}

tprint(" - " + startedServer + " servers started.");
tprint(" - " + alreadyStarted + " servers already started.");
tprint(" - " + couldNotBeStarted + " servers couldn't be started started.");
tprint("[EXIT]");