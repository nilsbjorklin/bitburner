var logLevels = {
    TRACE: {
        name: "TRACE",
        value: 1,
        color: "green"

    },
    INFO: {
        name: "INFO",
        value: 1,
        color: "white"

    },
    ERROR: {
        name: "ERROR",
        value: 1,
        color: "red"

    }
};

let logLevel = logLevels["INFO"];

// Logging individual messages
export function trace(functionName, message) {
    logArr("TRACE", functionName, [message]);
}

export function info(functionName, message) {
    logArr("INFO", functionName, [message]);
}

export function error(functionName, message) {
    logArr("ERROR", functionName, [message]);
}

// Logging array pf messages
export function traceArr(functionName, messages) {
    logArr("TRACE", functionName, messages);
}

export function infoArr(functionName, messages) {
    logArr("INFO", functionName, messages);
}

export function errorArr(functionName, messages) {
    logArr("ERROR", functionName, messages);
}

export function setLogLevel(newLogLevel) {
    let newLogLevelObject = logLevels[newLogLevel.toUpperCase()];
    
    if(newLogLevelObject === undefined){
        throw new Error( newLogLevel + "is not a valid log level.");
    }
    
    logLevel = newLogLevelObject;

}

function logHeader(logLevel, functionName) {
    tprintColored(`${getTime()} [${logLevel.toUpperCase()}] ${functionName}`, logLevels[logLevel.toUpperCase()].color);
}

function getTime() {
    var now = new Date();
    return sprintf('%s:%s:%s.%s',
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds());
}

function logArr(logLevel, functionName, messages) {
    if (isLogLevel(logLevels[logLevel])) {
        logHeader(logLevel, functionName);

        for (let i = 0; i < messages.length; i++){
            tprintColored(`- ${messages[i]}`, logLevels[logLevel.toUpperCase()].color);
        }
    }
}

function isLogLevel(currentLogLevel) {
    if(currentLogLevel === undefined)
        throw new Error("Cannot log with level undefined.");
    else if(logLevel === undefined){
        throw new Error("Log Level is undefined.");
    }
    return currentLogLevel.value >= logLevel.value;
}

function tprintColored(txt, color) {
    let terminalInput = document.getElementById("terminal-input");
    let rowElement = document.createElement("tr");
    let cellElement = document.createElement("td");

    rowElement.classList.add("posted");
    cellElement.classList.add("terminal-line");
    cellElement.style.color = color;
    cellElement.innerText = txt;

    rowElement.appendChild(cellElement);
    terminalInput.before(rowElement);
}