if (args.length < 2) {
    tprint("MORE ARGUMENTS");
    exit();
}
var portNumber = args[0];
var fileName = args[1];
var buyLimit = 100;
var sellLimit = 50;
var logPort = 4;
var logFile = "market.txt";
var logger = "/script/logger.script"

run(logger, 1, logPort, logFile, "MARKET");

info("START", " - Setting up listener on port " + portNumber +
    "\n - FILE: '" + fileName + "'" +
    "\n - LIMITS\n   - PURCHASE: " + buyLimit +
    "\n   - SALE: " + sellLimit);

write(fileName, buyLimit);


while (buyLimit >= sellLimit) {
    if (peek(portNumber) !== "NULL PORT DATA") {
        buyLimit++;
        var content = read(portNumber);
        info("INPUT", content);

        if (content === "EXIT") {
            sellLimit = 9999;
        }
        setLimits();
    } else if (buyLimit > 50) {
        buyLimit--;
        setLimits();
    } 
}
tprint("EXIT: /script/stocks/monitorMarket.script");
write(logPort, "EXIT");
exit();


function info(title, message) {
    logMessage("INFO", title, message);
}

function trace(title, message) {
    logMessage("TRACE", title, message);
}

function logMessage(logLevel, title, message) {
    write(logPort, sprintf("%s:%5s %-8s\n - %s",
        logLevel,
        "[MARKET]",
        title,
        message
    ));
}

function setLimits() {
    var limits = buyLimit + "/" + sellLimit;
    trace("LIMITS", "BUY: "+  buyLimit + " SELL: " + sellLimit);
    write(fileName, limits, "w");
}

info("EXIT", "Listener is closed.");