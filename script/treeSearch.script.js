var hackedPort = 1;
var hackedFilename = "active.txt";
var remainingPort = 2;
var remainingFilename = "remaining.txt";
var allNodes = ["home"];
var excludedServerRegex = /^server+.*$/;

var dir = "/script/";

var startScript = dir + "runHacks.script";
var hackScript = dir + "hack.script";
var netstatListener = dir + "listenToPort.script";
var listenerCloser = dir + "stopListener.script";
var timeoutLimit = 50;
var scriptCost = getScriptRam(startScript, allNodes[0]);
var log = "/searchLog.txt";

tprint("[START] Tree search.");


run(netstatListener, 1, hackedPort, hackedFilename);
run(netstatListener, 1, remainingPort, remainingFilename);

var currentIndex = 0,
    startedServer = 0,
    foundServers = 0,
    alreadyStarted = 0,
    couldNotBeStarted = 0;

while (currentIndex < allNodes.length) {
    var currentNode = allNodes[currentIndex];
    var adjecentNodes = scan(currentNode);

    for (var index in adjecentNodes) {
        var node = adjecentNodes[index];
        if (!nodeExists(node) && !excludedServerRegex.test(node)) {
            var serverRam = getServerRam(node);
            var freeRam = serverRam[0] - serverRam[1];
            write(log, " * Server found:'" + node + "' free ram: (" + freeRam + " GB) * ", "a");
            foundServers++;
            allNodes.push(node);

            if (freeRam >= scriptCost) {
                var iterationCount = 0;
                while (!scriptRunning(hackScript, node) && iterationCount <= timeoutLimit) {
                    if (iterationCount === 0) {
                        exec(startScript, allNodes[0], 1, node);
                    }
                    iterationCount++;
                }
                if (iterationCount >= timeoutLimit) {
                    write(log, " - Could not hack " + node, "a");
                    couldNotBeStarted++;
                    tryWrite(remainingPort, node + "PORT:" + getServerRequiredHackingLevel(node));
                } else if (iterationCount !== 0) {
                    write(log, " - " + node + " is now hacked.", "a");
                    startedServer++;
                    tryWrite(hackedPort, node);
                } else {
                    write(log, " - " + node + " is already hacked.", "a");
                    alreadyStarted++;
                    tryWrite(hackedPort, node);
                }
            } else {
                write(log, " - " + node + " does not have enough free ram.", "a");
                startedServer++;
                tryWrite(hackedPort, node);
            }
        }
    }
    currentIndex++;

}

tprint(" * " + foundServers + " servers found.");
tprint(" - " + startedServer + " servers started.");
tprint(" - " + alreadyStarted + " servers already started.");
tprint(" - " + couldNotBeStarted + " servers couldn't be started started.");
tprint("[EXIT] Tree search.");

function nodeExists(node) {
    if (allNodes.indexOf(node) === -1) {
        return false;
    } else {
        return true;
    }
}