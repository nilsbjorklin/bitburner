let servers;

export function main(ns) {
    ns.disableLog("ALL");

    if (ns.args[0].toUpperCase() === "FIND") {
        let target = ns.args[1];

        if (servers === undefined) {
            addServers(ns);
        }

        let path = getPath(getServer(target));
        ns.tprint(`Path to server '${target}':\n ${path}`);

    } else if (ns.args[0].toUpperCase() === "ADD") {
        addServers(ns);
    } else if (ns.args[0].toUpperCase() === "PRINT") {

        if (servers === undefined) {
            addServers(ns);
        }

        printServers(ns);
    } else {
        ns.tprint("INVALID OPTION: " + ns.args[0]);
    }
}


function printServers(ns) {
    for (let i = 0; i < servers.length; i++) {
        let server = servers[i];
        ns.tprint(`\nServer name: ${server.name}\nParent name: ${server.parent !== undefined ? server.parent.name: undefined}`);
    }
}

function addServers(ns) {
    servers = [];
    addServer("home", undefined);

    for (let i = 0; i < servers.length; i++) {
        let server = servers[i];
        addAdjacent(ns, server);
    }
}

function addServer(name, parent) {
    if (getServer(name) === undefined)
        servers.push({ name: name, parent: parent });
}

function getServer(name) {
    for (let i = 0; i < servers.length; i++) {
        if (servers[i].name == name) {
            return servers[i];
        }
    }
    return undefined;
}

function getPath(node) {
    if (node === undefined)
        return undefined;

    let parentNode = node.parent;
    let path = `${node.name}`

    if (node.parent === undefined) {
        return path;
    } else {
        return `${getPath(node.parent)} -> ${node.name}`
    }
}

function addAdjacent(ns, server) {
    let nearbyServers = ns.scan(server.name);

    ns.print(`Getting adjacent for '${server.name}'`);
    for (let i = 0; i < nearbyServers.length; i++) {
        addServer(nearbyServers[i], server);
    }
}