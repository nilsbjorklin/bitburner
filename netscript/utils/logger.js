var logLevels = {
    trace: {
        value: 1,
        color: "green"

    },
    info: {
        value: 2,
        color: "white"

    },
    error: {
        value: 3,
        color: "red"

    }
};

let logLevel = logLevels["info"];

// Logging individual messages
export function trace(functionName, message) {
    logArr("trace", functionName, [message]);
}

export function info(functionName, message) {
    logArr("info", functionName, [message]);
}

export function error(functionName, message) {
    logArr("error", functionName, [message]);
}

// Logging array pf messages
export function traceArr(functionName, messages) {
    logArr("trace", functionName, messages);
}

export function infoArr(functionName, messages) {
    logArr("info", functionName, messages);
}

export function errorArr(functionName, messages) {
    logArr("error", functionName, messages);
}

export function setLogLevel(newLogLevel) {
    logLevel = logLevels[newLogLevel.toLowerCase()];

}

function logHeader(logLevel, functionName) {
    tprintColored(`${getTime()} [${logLevel.toUpperCase()}] ${functionName}`, logLevels[logLevel].color);
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
    if (isLogLevel(logLevel)) {
        logHeader(logLevel, functionName);

        for (let i = 0; i < messages.length; i++)
            tprintColored(`    ${messages[i]}`, logLevels[logLevel].color);
    }
}

function isLogLevel(currentLogLevel) {
    return logLevels[currentLogLevel].value >= logLevel.value;
}

export function tprintColored(txt, color) {
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