
var database;
var numRow, numCol;
var acrossData = [], downData = [];
var colInd, rowInd;
var revealCount = 0; // number of answers revealed
var numOfAns = 0; // total number of answer the user guess or revealed
var timDiff = 0; // keep track of time to solve the puzzle
var timeId; // id to store the timer
const startTime = new Date();

function displayTime() {
    const time = document.getElementById("time");
    var curTime = new Date();
    timDiff = Math.floor((curTime - startTime) / 1000);
    time.innerText = timDiff;
    timeId = setTimeout(displayTime, 1000);
}
function clearInput() {
    var answer = document.getElementById("answer");
    answer.value = "";
}
function reloadPage() {
    location.href = "./../public/option.html";
}
function endTheGame() { // if numOfAns is same as number of data in the puzzle
    if (numOfAns === database.length - 1) {
        const score = document.getElementById("score");
        const numAns = document.getElementById("numans");
        const revealAns = document.getElementById("revealans");
        score.innerText = timDiff + 100 * revealCount;
        numAns.innerText = numOfAns - revealCount;
        revealAns.innerText = revealCount;
        const endGame = document.getElementById("endgame");
        endGame.classList.add("endgame-show");

        // when the game is end stop the timer ans change the color of time
        clearTimeout(timeId);
        const timer = document.getElementById("timer");
        timer.style.color = "green";
    }
}
function displayAnswerOnGrid() {
    numOfAns++;
    const tab1 = document.getElementById("tab1");
    if (colInd === 0) { // across the table means row number is fixed
        var ans = acrossData[rowInd - 1].val;
        for (var i = 0; i < ans.length; i++) {
            const data = tab1.rows[acrossData[rowInd - 1].rowInd].cells[acrossData[rowInd - 1].colInd + i];
            // data.style.padding = "25px 0";
            data.style.textAlign = "center";
            data.innerText = ans[i];
        }
    } else if (colInd === 1) { // top down of the table means col number is fixed
        var ans = downData[rowInd - 1].val;
        for (var i = 0; i < ans.length; i++) {
            const data = tab1.rows[downData[rowInd - 1].rowInd + i].cells[downData[rowInd - 1].colInd];
            // data.style.padding = "14px 0";
            data.style.textAlign = "center";
            data.innerText = ans[i];
        }
    }
    hidePopup(); // after displaying the answer hide the popup
}
function revealAnswer() {
    displayAnswerOnGrid();
    revealCount++;
    const tableData = document.getElementById("tab2").rows[rowInd].cells[colInd];
    tableData.classList.add("reveal-ans");
    endTheGame();
}
function matchAnswer() {
    var answer = document.getElementById("answer").value;
    if (answer.length === 0) {
        alert("Text field is empty");
    }
    else if (colInd === 0) {
        if (answer.toLowerCase() !== acrossData[rowInd - 1].val) {
            alert("Answer not correct");
        } else {
            displayAnswerOnGrid();
            const tableData = document.getElementById("tab2").rows[rowInd].cells[colInd];
            tableData.classList.add("correct-ans");
            endTheGame();
        }
    }
    else if (colInd === 1) {
        if (answer !== downData[rowInd - 1].val) {
            alert("Answer not correct");
        } else {
            displayAnswerOnGrid();
            const tableData = document.getElementById("tab2").rows[rowInd].cells[colInd];
            tableData.classList.add("correct-ans");
            endTheGame();
        }
    }
}
function hidePopup() {
    const popup = document.getElementById("popup");
    popup.style.visibility = "hidden";
}

// below function used to create empty table row and return it
function createEmptyTableRowObj(numCol) {
    const tableRow = document.createElement("tr");
    for (var i = 0; i < numCol; i++) {
        const tableCol = document.createElement("td");
        tableCol.style.border = "0.5px solid black";
        tableCol.style.margin = "0";
        tableCol.style.padding = "25px";
        tableCol.style.backgroundColor = "black";
        tableRow.appendChild(tableCol);
    }
    return tableRow;
}

// below function used to fill the clue table
function fillClueTable(acrossData, downData) {
    const table2 = document.getElementById("tab2");
    const lenAcross = acrossData.length;
    const lenDown = downData.length;
    var i = 0;
    var mn = Math.min(lenAcross, lenDown);

    while (i < mn) {
        i++;
        const tableRow = document.createElement("tr");

        const tableCol1 = document.createElement("td");
        tableCol1.innerHTML = "<b>" + acrossData[i - 1].ind + "</b>" + " " + acrossData[i - 1].clue;
        tableCol1.style.paddingRight = "20px";
        tableCol1.setAttribute('class', 'cluetd');
        tableRow.appendChild(tableCol1);

        const tableCol2 = document.createElement("td");
        tableCol2.innerHTML = "<b>" + downData[i - 1].ind + "</b>" + " " + downData[i - 1].clue;
        tableCol2.setAttribute('class', 'cluetd');
        tableRow.appendChild(tableCol2);

        table2.appendChild(tableRow);
    }

    if (i < lenAcross) {
        while (i < lenAcross) {
            i++;
            const tableRow = document.createElement("tr");
            const tableCol1 = document.createElement("td");
            tableCol1.innerHTML = "<b>" + acrossData[i - 1].ind + "</b>" + " " + acrossData[i - 1].clue;
            tableCol1.style.paddingRight = "20px";
            tableCol1.setAttribute('class', 'cluetd');
            tableRow.appendChild(tableCol1);

            const tableCol2 = document.createElement("td");
            tableCol2.setAttribute('class', 'cluetd');
            tableRow.appendChild(tableCol2);

            table2.appendChild(tableRow);
        }
    }
    if (i < lenDown) {
        while (i < lenDown) {
            i++;
            const tableRow = document.createElement("tr");

            const tableCol1 = document.createElement("td");
            tableCol1.style.paddingRight = "20px";
            tableCol1.setAttribute('class', 'cluetd');
            tableRow.appendChild(tableCol1);

            const tableCol2 = document.createElement("td");
            tableCol2.innerHTML = "<b>" + downData[i - 1].ind + "</b>" + " " + downData[i - 1].clue;
            tableCol2.setAttribute('class', 'cluetd');
            tableRow.appendChild(tableCol2);

            table2.appendChild(tableRow);
        }
    }
}
// below function used to make visible the cell which corresponding to the answer
function makeTheCellVisible() {
    for (var i = 1; i < database.length; i++) {
        const dir = database[i].dir;
        const ans = database[i].val;
        const rowInd = database[i].rowInd;
        const colInd = database[i].colInd;
        if (dir === 0) { // across the board (row number is fixed)
            for (var j = 0; j < ans.length; j++) {
                const colData = document.getElementById("tab1").rows[rowInd].cells[colInd + j];
                colData.style.backgroundColor = "white";
            }
        } else {
            for (var j = 0; j < ans.length; j++) {
                const colData = document.getElementById("tab1").rows[rowInd + j].cells[colInd];
                colData.style.backgroundColor = "white";
            }
        }
    }
}
displayTime();

const ws = new WebSocket("ws://localhost:8082");
ws.binaryType = "arraybuffer";

ws.addEventListener("message",(e) => {
    var newdata = JSON.parse(e.data);
    rowIndexPuzzle = newdata[0];
    data = newdata[rowIndexPuzzle+1];
    database = data;

    numRow = data[0].row;
    numCol = data[0].col;
    // creating table element
    const table1 = document.createElement("table");
    table1.setAttribute('id', "tab1") // assigning id to the table
    // appending rows in the table 
    for (var i = 0; i < numRow; i++) {
        table1.appendChild(createEmptyTableRowObj(numCol));
    }
    // appending table to the div element
    const div1Ele = document.getElementById("div1");
    table1.classList.add("crossword-table");
    div1Ele.appendChild(table1);

    // document.getElementById("tab1").rows[0].cells[0].innerHTML = "h";
    for (var i = 1; i < data.length; i++) {
        if (data[i].dir === 0) { // across the table
            acrossData.push(data[i]);
        } else { // top down of the table
            downData.push(data[i]);
        }
    }

    // fill the clue table with appropriate clue along with index
    fillClueTable(acrossData, downData);

    // showing indices in the crossword board according to the clue
    for (var i = 1; i < data.length; i++) {
        const colData = document.getElementById("tab1").rows[data[i].rowInd].cells[data[i].colInd];
        colData.innerHTML = "<b>" + data[i].ind + "</b>";
        colData.style.color = "blue";
    }
    // make visible the cell which corresponding to the answer
    makeTheCellVisible();

    // use event listener to get the current cell has been clicked
    const cells = document.querySelectorAll('.cluetd');

    cells.forEach(cell => {
        cell.addEventListener('click', () =>{
            clearInput(); // on clicking on some clue it will clear the text inside the text input
            rowInd = cell.closest('tr').rowIndex;
            colInd = cell.cellIndex;
            var popup = document.getElementById("popup");
            const clue = document.getElementById("clue");

            if(rowInd !== undefined && colInd !== undefined){
                const clueData = document.getElementById("tab2").rows[rowInd].cells[colInd];
                // if the data corresponding the clue already shown then don't do anything
                if(clueData.classList.contains("reveal-ans") === false) {
                    if (colInd === 0) { // across data
                        clue.innerHTML = "<b>clue : </b>" + acrossData[rowInd - 1].clue;
                        popup.style.visibility = "visible";
                        // popup.classList.add("show");
                    } else if (colInd === 1) { // down data
                        clue.innerHTML = "<b>clue : </b>" + downData[rowInd - 1].clue;
                        // popup.classList.add("show");
                        popup.style.visibility = "visible";
                    }
                }
            }
        });
    });
});


