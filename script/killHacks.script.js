var targetServer = args[0];

if (args.length === 0) {
    targetServer = getHostname();
}
killall(targetServer);

var scripts = ls(targetServer, ".script");

for (var index in scripts) {
    var script = scripts[index];
    rm(script, targetServer);
}