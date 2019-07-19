let home = "home";
let threshold = 0.1;

export async function main(ns) {
    ns.disableLog("ALL");
    
    if (ns.args[0].toUpperCase() === "START") {
        while(true){
            let maxServerRam = maxServer(ns, 0);
            if(getServerLimit(ns) > getServers(ns).length){
                ns.print(`\nTrying to buy server with ${maxServerRam}GB ram.`);
                let purchasedServer = ns.purchaseServer(`botnet-${maxServerRam}GB`, maxServerRam);
                ns.tprint("SERVER: " + purchasedServer);
            } else {
                ns.print(`\nMax number of servers owned: ${getServerLimit(ns)}`);
            }
            await ns.sleep(10000);
        }
    } else if (ns.args[0].toUpperCase() === "PRINT"){ 
        printServers(ns);
    }
}

function getServers(ns){
    return ns.getPurchasedServers(true);
}

function getServerLimit(ns){
    return ns.getPurchasedServerLimit();
}
function printServers(ns){
    let servers = getServers(ns);
    let serverString = `\n Servers owned: ${servers.length}/${getServerLimit(ns)}:`;
    
    for(let i = 0; i < servers.length; i++){
        serverString += `\n - ${servers[i]}, RAM: ${ns.getServerRam(servers[i])[0]}GB/${ns.nFormat(ns.getPurchasedServerMaxRam(servers[i]), "0")}GB`;
    }
    ns.tprint(serverString);
}

function maxServer(ns, ram) {
    let newRam = ram * 2;
    if (newRam === 0) {
        newRam = 2;

    }
    
    let ramCost = ns.getPurchasedServerCost(newRam);
    let money = checkMoney(ns);
    
    if (money > ramCost) {
        return maxServer(ns, newRam);
    } else {
        ns.print(`Max ram for purchase: ${ns.nFormat(ram, "0GB")}GB cost: ${ns.nFormat(ns.getPurchasedServerCost(ram), "$0.000a")}/${ns.nFormat(money, "$0.000a")}`);
        return ram;
    }
}

function checkMoney(ns) {
    return ns.getServerMoneyAvailable(home) * threshold;
}