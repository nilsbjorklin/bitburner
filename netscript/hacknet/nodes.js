let home = "home";
let threshold = 0.01;

export async function main(ns) {
    ns.disableLog("ALL");
    while (true) {
        if (checkMoney(ns) > ns.hacknet.getPurchaseNodeCost()) {
            let index = ns.hacknet.purchaseNode();
            if (index !== -1) {
                ns.tprint("Bought hacknet-node-" + index);
                upgradeHacknetNode(ns, index);
            } else {
                ns.tprint("Failed to buy hacknet-node-" + index);
            }
        } else {
            ns.print("Not enough money to buy hacknet-node");
        }
        await ns.sleep(10000);
    }
}

async function upgradeHacknetNode(ns, index) {
    while (true) {
        ns.print("Checking if there is enough money to upgrade hacknet-node-" + index);
        
        let levelCost = ns.hacknet.LevelUpgradeCost(i, 1);
        let ramCost = ns.hacknet.getRamUpgradeCost(i, 1);
        let coreCost = ns.hacknet.getCoreUpgradeCost(i, 1);
        if (Infinity === levelCost &&
            Infinity === ramCost &&
            Infinity === coreCost)
            return true;

        checkMoney(ns)
        if (levelCost < money) {
            ns.print("Bought level for hacknet-node-" + index);
            ns.hacknet.upgradeLevel(i, 1);
        }

        checkMoney(ns)
        if (ramCost < money) {
            ns.print("Bought ram for hacknet-node-" + index);
            ns.hacknet.upgradeRam(i, 1);
        }

        checkMoney(ns)
        if (coreCost < money) {
            ns.print("Bought core for hacknet-node-" + index);
            ns.hacknet.upgradeCore(i, 1);
        }

        await ns.sleep(500);
    }
}

function checkMoney(ns) {
    return ns.getServerMoneyAvailable(home) * threshold;
}