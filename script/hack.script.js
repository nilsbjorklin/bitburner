var target = args[0];
var moneyThresh = getServerMaxMoney(target) * 0.75;
var securityThresh = getServerMinSecurityLevel(target) + 5;
var interation = 0;
while (true) {
    print(" * Iteration " + interation);
    if (getServerSecurityLevel(target) > securityThresh) {
        print(" - Weaken server " + target);
        weaken(target);
    } else if (getServerMoneyAvailable(target) < moneyThresh) {
        print(" - Grow server " + target);
        grow(target);
    } else {
        print(" - Hack server " + target);
        hack(target);
    }
    interation++;
}