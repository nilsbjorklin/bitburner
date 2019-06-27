var home = "home";
var dir = "/script/";

var stopScript = dir + "killHacks.script";
var netstatListener = dir + "listenToPort.script";
var hackScript = dir + "hack.script";

var fileName = "active.txt";
var fileContent = read(fileName);
var serversStopped = 0;
var timeoutLimit = 50;

tprint("[START]");

var rows = fileContent.split("\n");
for (var index in rows) {
    var row = rows[index];

    if (row.length !== 0) {

        var iterationCount = 0;
        while (scriptRunning(hackScript, row) && iterationCount <= timeoutLimit) {
            if (iterationCount === 0) {
                exec(stopScript, home, 1, row);
            }
            iterationCount++;
        }
        
        if (iterationCount === timeoutLimit) {
            tprint(" - Could not stop " + row);
        } else if (iterationCount !== 0){
            tprint(" - " + row + " is now stopped.");
            serversStopped++;
        } else {
            tprint(" - " + row + " is already stopped.");
        }
    }
}

tprint(" - Clearing file " + fileName + ".");
clear(fileName);
tprint("[END] Stopped " + serversStopped + " servers.");