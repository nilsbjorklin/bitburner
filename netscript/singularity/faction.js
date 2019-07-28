let cityFactions = ["Sector-12",
    "Chongqing",
    "New Tokyo",
    "Ishima",
    "Aevum",
    "Volhaven"];

export async function main(ns) {
    while (true) {
        start(ns);
        await ns.sleep(60000);
    }
}

export async function start(ns) {
    ns.disableLog("ALL");
    while (true) {
        joinFactions(ns);

        if (!ns.isBusy())
            ns.print("Starting faction."); //createPrograms(ns);
        else
            ns.print("Already working.")

        await ns.sleep(60000);
    }
}

function joinFactions(ns) {
    let factionInvitations = ns.checkFactionInvitations();
    for (let i = 0; i < factionInvitations.length; i++) {
        if (cityFactions.indexOf(factionInvitations[i]) !== -1) {
            ns.tprint(`Accepted invitation to faction '${factionInvitations[i]}'`);
            ns.joinFaction(factionInvitations[i]);
        }
    }
}