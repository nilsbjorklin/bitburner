export function tprintColored(txt, color) {
    let terminalInput   = document.getElementById("terminal-input");
    let rowElement      = document.createElement("tr");
    let cellElement     = document.createElement("td");

    rowElement.classList.add("posted");
    cellElement.classList.add("terminal-line");
    cellElement.style.color = color;
    cellElement.innerText = txt;

    rowElement.appendChild(cellElement);
    terminalInput.before(rowElement);
}

export async function main(ns) {
    tprintColored("Red Text!", "red");
    tprintColored("Blue Text!", "blue");
    tprintColored("Use Hex Codes!", "#3087E3");
}