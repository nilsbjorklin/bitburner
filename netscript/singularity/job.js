let jobs;
let jobIndex = -1;

export async function main(ns) {
    addJobs();
    while (true) {
        if (getJob(ns)) {
            let job = jobs[jobIndex];
            let newJob = ns.applyToCompany(job.company, job.role);
            if (newJob) {
                ns.print(`\nNew job:\n - Company: ${job.company}\n - Role: ${job.role}`);
                if (ns.isBusy())
                    ns.workForCompany(job.company);
                ns.print(`\nStarted working at:\n - Company: ${job.company}\n - Role: ${job.role}`);
            } else {
                ns.print(`\nCould not get new job:\n - Company: ${job.company}\n - Role: ${job.role}`);
            }
        }
        await ns.sleep(60000);
    }
}

function getJob(ns) {
    let stats = ns.getStats();
    let newIndex = 0;
    for (let i = 0; i < jobs.length; i++) {
        if (checkRequirements(ns, jobs[i], stats)) {
            newIndex = i;
        }
    }
    if (newIndex !== jobIndex) {
        jobIndex = newIndex;
        let job = jobs[jobIndex];
        ns.print(`\nFound new job:\n - Company: ${job.company}\n - Role: ${job.role}`);
        return true;
    }
}

function checkRequirements(ns, job, stats) {
    let reputation = ns.getCompanyRep(job.company);

    if (job.requires.hacking > stats.hacking)
        return false;

    if (job.requires.strength > stats.strength)
        return false;

    if (job.requires.defense > stats.defense)
        return false;

    if (job.requires.dexterity > stats.dexterity)
        return false;

    if (job.requires.agility > stats.agility)
        return false;

    if (job.requires.charisma > stats.charisma)
        return false;

    if (job.requires.reputation > reputation)
        return false;

    return true;

}

function addJobs() {
    jobs = [];
    addJob("Joe's Guns", "employee", 0, 0, 0, 0, 0, 0, 0);
    addJob("Alpha Enterprises", "software", 100, 0, 0, 0, 0, 0, 0);
    addJob("Alpha Enterprises", "software", 150, 0, 0, 0, 0, 0, 8000);
}

function addJob(company, role, hacking, strength, defense, dexterity, agility, charisma, reputation) {
    jobs.push({
        company: company,
        role: role,
        requires: {
            hacking: hacking,
            strength: strength,
            defense: defense,
            dexterity: dexterity,
            agility: agility,
            charisma: charisma,
            reputation,
            reputation
        }
    });
}