if (args.length < 1) {
    tprint("Portnumber must be provided.");
    exit();
}

var portNumber = args[0];

var stopping = false;

while (true) {
    if (peek(portNumber) !== "NULL PORT DATA") {
        var content = read(portNumber);
        var parts = content.split("§");
        var fileName = "/log/" + parts[0] + ".txt";

        tprint("Trying to log to: '" + fileName + "'...");

        if (parts[1] === "CLEAR") {
            clear(fileName);
            tprint("\nLOG: '" + fileName + "' cleared!");
        } else if (parts[1] === "EXIT") {
            tprint("GOT EXIT COMMAND FROM: " + parts[0]);
            stopping = true;
        } else {

            if (parts[1].toUpperCase() !== "TRACE")
                for (var i = 0; i < parts.length; i++) tprint("TRACE:" + parts[i]);

            for (var i = 0; i < parts.length; i++)
                logMessage(fileName, parts[i]);
        }
    } else if(stopping){
        tprint("\n******************************************\nEXITING\n******************************************");
        exit();
    }
}

function logMessage(fileName, content) {
    write(fileName, content);
}