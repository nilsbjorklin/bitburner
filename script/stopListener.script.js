var home = "home";
var dir = "/script/";
var searchScript = dir + "treeSearch.script";
var netstatListener = dir + "listenToPort.script";
var portNumber = args[0];
var fileName = args[1];
var timeoutLimit = 50;

tprint("[START] Waiting for tree search to complete...");

while (scriptRunning(searchScript, home));

tprint("Tree search complete, trying to close Netstat listener.");

var iterationCount = 0;
while (scriptRunning(netstatListener, home) && iterationCount <= timeoutLimit) {
    if (iterationCount === 0) {
        kill(netstatListener, home, portNumber, fileName);
    }
    iterationCount++;
}

if (iterationCount === timeoutLimit) {
    tprint(" - Could not close netstat listener " + row);
} else if (iterationCount !== 0) {
    tprint(" - Netstat listener is now stopped.");
} else {
    tprint(" - Netstat listener is already stopped.");
}

tprint("[END]");