if (args.length < 2) {
    tprint("Portnumber and filename must be provided.");
    exit();
}
var portNumber = args[0];
var fileName = args[1];

var home = "home";
var dir = "/script/";
var searchScript = dir + "treeSearch.script";
var tryScript = dir + "tryRemaining.script";
var portNumber = args[0];
var fileName = args[1];

tprint("[START]\n - Setting up listener on port " + portNumber + "\n - Writing message to file '" + fileName + "'.");

clear(fileName);


while (scriptRunning(searchScript, home) || scriptRunning(tryScript, home)) {
    if (peek(portNumber) !== "NULL PORT DATA") {
        var content = read(portNumber);
        print("Incommings message: " + content + "\nWriting to file: " + fileName);
        write(fileName, content + "\n");
    }
}

tprint("[EXIT] Listener is closed.");