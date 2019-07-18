let stocks = "/netscript/stock/stocks.js";
let search = "/netscript/hack/search.js";
let nodes = "/netscript/hacknet/nodes.js";
let home = "home";

export async function main(ns) {
  let argument = ns.args[0].toUpperCase();

  if (argument === "START-STOCKS") {
    await ns.run(stocks, 1, "START");
  }

  if (argument === "START-SEARCH") {
    await ns.run(search, 1, "START");
  }

  if (argument === "START-HACKNET-NODES") {
    await ns.run(nodes, 1);
  }

  if (argument === "STOP-STOCKS") {
    await ns.run(stocks, 1, "STOP");
  }

  if (argument === "STOP-SEARCH") {
    await ns.run(search, 1, "STOP");
  }

  if (argument === "STOP-HACKNET-NODES") {
    await ns.kill(nodes, home);
  }

  if (argument === "START") {
    let currentScript = ns.getScriptName();
    ns.tprint("Starting all scripts.");

    await ns.run(currentScript, 1, "START-STOCKS");

    await ns.run(currentScript, 1, "START-SEARCH");

    await ns.run(currentScript, 1, "START-HACKNET-NODES");
  }

  if (argument === "STOP") {
    let currentScript = ns.getScriptName();

    ns.tprint("Stopping all scripts.");

    await ns.run(currentScript, 1, "STOP-STOCKS");

    await ns.run(currentScript, 1, "STOP-SEARCH");

    await ns.run(currentScript, 1, "STOP-HACKNET-NODES");

    await ns.sleep(500);

    ns.tprint("All scripts killed.");
  }
}
