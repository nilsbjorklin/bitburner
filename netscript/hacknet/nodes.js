let home = "home";
let threshold = 0.01;

export async function main(ns) {
  ns.disableLog("ALL");
  while (true) {
    for (let i = 0; i < ns.numNodes(); i++) await upgradeHacknetNode(ns, i);

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
  let levelUpgrades = await upgradeLevel(ns, index, 0);
  let ramUpgrades = await upgradeRam(ns, index, 0);
  let coreUpgrades = await upgradeCores(ns, index, 0);
  if (levelUpgrades !== 0)
    ns.tprint(`Bought ${levelUpgrades} levels for hacknet-node-${index}`);
  if (ramUpgrades !== 0)
    ns.tprint(`Bought ${ramUpgrades} ram upgrades for hacknet-node-${index}`);
  if (coreUpgrades !== 0)
    ns.tprint(`Bought ${coreUpgrades} cores for hacknet-node-${index}`);
}

async function upgradeLevel(ns, index, upgraded) {
  let levelCost = ns.hacknet.LevelUpgradeCost(index, 1);
  checkMoney(ns);
  if (levelCost < money) {
    await ns.sleep(100);
    ns.print("Bought level for hacknet-node-" + index);
    ns.hacknet.upgradeLevel(index, 1);
    return await upgradeLevel(ns, index, upgraded + 1);
  } else {
    return upgraded;
  }
}

async function upgradeRam(ns, index, upgraded) {
  let ramCost = ns.hacknet.getRamUpgradeCost(index, 1);
  checkMoney(ns);
  if (ramCost < money) {
    await ns.sleep(100);
    ns.print("Bought ram for hacknet-node-" + index);
    ns.hacknet.upgradeRam(index, 1);
    return await upgradeRam(ns, index, upgraded + 1);
  } else {
    return upgraded;
  }
}

async function upgradeCores(ns, index, upgraded) {
  let coreCost = ns.hacknet.getCoreUpgradeCost(index, 1);
  checkMoney(ns);
  if (coreCost < money) {
    await ns.sleep(100);
    ns.print("Bought core for hacknet-node-" + index);
    ns.hacknet.upgradeCore(index, 1);
    return await upgradeCores(ns, index, upgraded + 1);
  } else {
    return upgraded;
  }
}

function checkMoney(ns) {
  return ns.getServerMoneyAvailable(home) * threshold;
}
