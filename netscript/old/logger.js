var logLevels = {
    TRACE: {
        name: "TRACE",
        value: 1,
        color: "white"

    },
    DEBUG: {
        name: "DEBUG",
        value: 2,
        color: "white"

    },
    INFO: {
        name: "INFO",
        value: 3,
        color: "white"

    },
    ERROR: {
        name: "ERROR",
        value: 4,
        color: "red"

    }
};

let logLevel = logLevels["INFO"];

// Logging individual messages
export function debug(functionName, message) {
    logArr("DEBUG", functionName, [message]);
}

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
export function debugArr(functionName, messages) {
    logArr("DEBUG", functionName, messages);
}

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

    if (newLogLevelObject === undefined) {
        throw new Error(newLogLevel + "is not a valid log level.");
    }

    logLevel = newLogLevelObject;

}

function logHeader(logLevel, functionName) {
    tprintColored(`${getTime()} [${logLevel.toUpperCase()}] ${functionName}`, logLevels[logLevel.toUpperCase()].color);
}

function logLine(logLevel, functionName, line) {
    tprintColored(`${getTime()} [${logLevel.toUpperCase()}] ${functionName} ${line}`, logLevels[logLevel.toUpperCase()].color);
}

function getTime() {
    var now = new Date();
    return sprintf('%s:%s:%s.%-4s',
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds());
}

function logArr(logLevel, functionName, messages) {
    if (isLogLevel(logLevels[logLevel])) {
        if (messages.length === 1) {
            logLine(logLevel, functionName, messages[0]);
        } else {
            logHeader(logLevel, functionName);

            for (let i = 0; i < messages.length; i++) {
                tprintColored(`- ${messages[i]}`, logLevels[logLevel.toUpperCase()].color);
            }
            tprintColored("\n", logLevels[logLevel.toUpperCase()].color);
        }
    }
}

function isLogLevel(currentLogLevel) {
    if (currentLogLevel === undefined)
        throw new Error("Cannot log with level undefined.");
    else if (logLevel === undefined) {
        throw new Error("Log Level is undefined.");
    }

    return currentLogLevel.value >= logLevel.value;
}

export function throwNewError(text) {
    error("EXCEPTION", text);
    //throw text;
}

export function throwNewErrorArr(arr) {
    errorArr("EXCEPTION", arr);
    //throw arr;
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