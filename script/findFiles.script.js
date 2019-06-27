var allNodes = ["home"];
var excludedServerRegex = /^server+.*$/;

var scriptRegex = /^.*script$/;

var currentIndex = 0;
var filesFound = 0;

tprint("[START] Tree search for files.");


while (currentIndex < allNodes.length) {
    var currentNode = allNodes[currentIndex];
    tprint(" - Getting adjecent nodes to '" + currentNode + "'.");

    var adjecentNodes = scan(currentNode);

    for (var index in adjecentNodes) {
        var node = adjecentNodes[index];
        if (!nodeExists(node) && !excludedServerRegex.test(node)) {
            tprint(" * Server found:'" + node + "' * ");
            allNodes.push(node);
            var files = ls(node);
            for (var index in files) {
                var file = files[index];
                if (!scriptRegex.test(file)) {
                    tprint(file);
                    filesFound++;
                }
            }
        }
    }
    currentIndex++;

}

tprint(" * " + filesFound + " files found.");
tprint("[EXIT] Tree search.");

function nodeExists(node) {
    if (allNodes.indexOf(node) === -1) {
        return false;
    } else {
        return true;
    }
}