var hackedFilename = "active.txt";
var remainingFilename = "remaining.txt";


var hackedServers = read(hackedFilename).split("\n");
var remainingServers = read(remainingFilename).split("\n");
tprint("Rows in files, active: " + hackedServers.length + ", remaining: " + remainingFilename.length);

tprint("[START] Trying to list servers.");

tprint(" * In active * ");
tprint(" * " + printRows(hackedServers) + " servers active.");

tprint(" * In remaining * ");
tprint(" * " + printRows(remainingServers) + " servers remaining.");

tprint("[EXIT]");

function printRows(arr) {
    var count = 0;
    for (var index in arr) {
        var node = arr[index];
        if (node.length !== 0) {
            count++;
            tprint(" - " + node);
        }
    }
    return count;
}