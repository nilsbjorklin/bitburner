let cityFactions = ["Sector-12", "Chongqing", "New Tokyo", "Ishima", "Aevum", "Volhaven"];
let characterInformation;

export async function main(ns) {
    while (true) {
        start(ns);
        await ns.sleep(60000);
    }
}

export async function start(ns) {
    ns.disableLog("ALL");
    joinFactions(ns);
    characterInformation = ns.getCharacterInformation();

    if (!ns.isBusy()) {
        startWork(ns, getFaction(ns));
    } else
        ns.print("Already working.")

    await ns.sleep(60000);
}

function getFaction(ns) {
    let factions = characterInformation.factions;
    let augmentations = ns.getOwnedAugmentations(true);
    for (let i = 0; i < factions.length; i++) {
        let factionName = factions[i];
        let factionAugmentations = ns.getAugmentationsFromFaction(factionName);
        for (let j = 0; j < factionAugmentations.length; j++) {
            if (augmentations.indexOf(factionAugmentations[j]) === -1 && /$NeuroFlux Governor.*^/) {
                ns.tprint(`Found augmentation: ${factionAugmentations[j]} for faction: ${factionName}`);
                return factionName;
            }
        }
    }
}

function startWork(ns, faction) {
    if (ns.workForFaction(faction, "hackingcontracts")) {
        ns.tprint("Started working on Hacking Contracts for " + faction);
    } else if (ns.workForFaction(faction, "fieldwork")) {
        ns.tprint("Started Field Work for " + faction);
    } else if (ns.workForFaction(faction, "securitywork")) {
        ns.tprint("Started Security Work for " + faction);
    } else {
        ns.tprint("Failed to start work for " + faction);
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