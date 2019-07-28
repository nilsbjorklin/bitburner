export async function main(ns) {
    while (true) {
        start(ns);
        await ns.sleep(60000);
    }
}

export function start(ns) {
    ns.disableLog("ALL");
    purchasePrograms(ns);

    if (!ns.isBusy())
        createPrograms(ns);
    else {
        ns.print("Already working.")
    }
}

function purchasePrograms(ns) {
    ns.print("Trying to purchase programs.");
    let tor;
    if (characterInformation.tor)
        tor = true
    else
        tor = ns.purchaseTor();

    if (tor) {
        addPrograms(ns);
        let programName = programs.shift().program;
        while (ns.purchaseProgram(programName)) {
            ns.tprint(`Bought program: ${programName}`);
            program = programs.shift().program;
        }
    }
}

function addPrograms(ns) {
    programs = [];
    addProgram(ns, "AutoLink.exe", 25);
    addProgram(ns, "ServerProfiler.exe", 75);
    addProgram(ns, "DeepscanV1.exe", 75);
    addProgram(ns, "FTPCrack.exe", 100);
    addProgram(ns, "relaySMTP.exe", 250);
    addProgram(ns, "DeepscanV2.exe", 400);
    addProgram(ns, "HTTPWorm.exe", 500);
    addProgram(ns, "SQLInject.exe", 750);
}

function addProgram(ns, name, hackingLevel) {
    if (!ns.fileExists(name)) {
        programs.push({
            program: name,
            hackingLevel: hackingLevel
        });
        ns.print("Added program: " + name);
    }
}

function createPrograms(ns) {
    let hackingLevel = ns.getHackingLevel();
    addPrograms(ns);
    if (programs.length > 0 && programs[0].hackingLevel <= hackingLevel) {
        ns.tprint("Starting to create program: " + programs[0].program);
        ns.createProgram(programs[0].program);
    }
}