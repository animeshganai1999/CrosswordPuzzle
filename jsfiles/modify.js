var database;
var numRow, numCol;
var newdata;
var colInd, rowInd;
var acrossData = [], downData = [];
var rowIndexPuzzle;
var count = 1;
const ws = new WebSocket("ws://localhost:8082");
ws.binaryType = "arraybuffer";

// below function used to create empty table row and return it
function createEmptyTableRowObj(numCol) {
    const tableRow = document.createElement("tr");
    for (var i = 0; i < numCol; i++) {
        const tableCol = document.createElement("td");
        tableCol.setAttribute("class", "data-tab");
        tableCol.style.border = "0.5px solid black";
        tableCol.style.margin = "0";
        tableCol.style.padding = "25px";
        tableCol.style.backgroundColor = "black";
        tableRow.appendChild(tableCol);
    }
    return tableRow;
}
// below function used to fill the clue table
function fillClueTable(data) {
    var tAcrossData = [];
    var tDownData = [];
    for (var i = 1; i < data.length; i++) {
        if (data[i].dir === 0) { // across the table
            tAcrossData.push(data[i]);
        } else { // top down of the table
            tDownData.push(data[i]);
        }
    }
    const divEle = document.getElementById("div2");
    const table2 = document.createElement("table");
    table2.setAttribute("id","tab2");
    table2.setAttribute("class","clue-table");

    const tabRow = document.createElement("tr");
    var tabCol = document.createElement("td");
    tabCol.style.textAlign = "center";
    tabCol.innerHTML = "<b>Across</b>";
    tabRow.appendChild(tabCol);
    tabCol = document.createElement("td");
    tabCol.style.textAlign = "center";
    tabCol.innerHTML = "<b>Down</b>";
    tabRow.appendChild(tabCol);
    table2.appendChild(tabRow);

    const lenAcross = tAcrossData.length;
    const lenDown = tDownData.length;
    var i = 0;
    var mn = Math.min(lenAcross, lenDown);

    while (i < mn) {
        i++;
        const tableRow = document.createElement("tr");

        const tableCol1 = document.createElement("td");
        tableCol1.innerHTML = "<b>" + tAcrossData[i - 1].ind + "</b>" + " " + tAcrossData[i - 1].clue;
        tableCol1.style.paddingRight = "20px";
        tableCol1.setAttribute('class', 'cluetd');
        tableRow.appendChild(tableCol1);

        const tableCol2 = document.createElement("td");
        tableCol2.innerHTML = "<b>" + tDownData[i - 1].ind + "</b>" + " " + tDownData[i - 1].clue;
        tableCol2.setAttribute('class', 'cluetd');
        tableRow.appendChild(tableCol2);

        table2.appendChild(tableRow);
    }

    if (i < lenAcross) {
        while (i < lenAcross) {
            i++;
            const tableRow = document.createElement("tr");
            const tableCol1 = document.createElement("td");
            tableCol1.innerHTML = "<b>" + tAcrossData[i - 1].ind + "</b>" + " " + tAcrossData[i - 1].clue;
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
            tableCol2.innerHTML = "<b>" + tDownData[i - 1].ind + "</b>" + " " + tDownData[i - 1].clue;
            tableCol2.setAttribute('class', 'cluetd');
            tableRow.appendChild(tableCol2);

            table2.appendChild(tableRow);
        }
    }
    acrossData = tAcrossData;
    downData = tDownData;
    divEle.appendChild(table2);
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



// create the clue table and display the index on the crossword table
function createAndDisplay(data){
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

    // fill the clue table with appropriate clue along with index
    fillClueTable(data);

    // showing indices in the crossword board according to the clue
    for (var i = 1; i < data.length; i++) {
        const colData = document.getElementById("tab1").rows[data[i].rowInd].cells[data[i].colInd];
        colData.innerHTML = "<b>" + data[i].ind + "</b>";
        colData.style.color = "blue";
    }

    // make visible the cell which corresponding to the answer
    makeTheCellVisible();
    var cells = document.querySelectorAll('.cluetd');
    cells.forEach(cell => {
        cell.addEventListener('click', () =>{
            rowInd = cell.closest('tr').rowIndex; // start from 1
            colInd = cell.cellIndex;
            // make the popup visible which corresponds to delete element
            var popup = document.getElementById("popup");
            popup.style.visibility = "visible";
        });
    });

    var dcell = document.querySelectorAll('.data-tab');
    dcell.forEach(cell => {
        cell.addEventListener('click', () =>{
        rowInd = cell.closest('tr').rowIndex;
        colInd = cell.cellIndex;
        // make the popup visible to take the input from user
        var popup = document.getElementById("popup1");
        popup.style.visibility = "visible";
        // console.log("Row index: " + cell.closest('tr').rowIndex + " | Column index: " + cell.cellIndex);
        });
    });
}

function deleteAllTables(){
    const table1 = document.getElementById("tab1");
    table1.remove();
    const table2 = document.getElementById("tab2");
    table2.remove();
}
// update acrossData and downData
function updateAcrorssDownData(data){
    var tAcrossData = [];
    var tDownData = [];
    for (var i = 1; i < data.length; i++) {
        if (data[i].dir === 0) { // across the table
            tAcrossData.push(data[i]);
        } else { // top down of the table
            tDownData.push(data[i]);
        }
    }
    acrossData = tAcrossData;
    downData = tDownData;
}
// hide popup window
function hidePopupDel(){
    var popup = document.getElementById("popup");
    popup.style.visibility = "hidden";
}
function hidePopup(){
    var popup = document.getElementById("popup1");
    popup.style.visibility = "hidden";
}

// save the puzzle 
function SaveThePuzzle(){
    // before sending data to the server rearrange the indices
    var len = database.length;
    if(len < 2){
        alert("There Should be some entry in the crossword board");
    }else{
        var newInd = 1;
        for(var i=1; i<len; i++) {
            database[i].ind = newInd;
            newInd++;
        }
        // modify will be inserted into the main data and send back to the server
        newdata[rowIndexPuzzle+1] = database;
        ws.send(JSON.stringify(newdata)); // send data back to server
        location.href = "/adminDelmod";
    }
}

// delete the specific data 
function deleteData(){
    var len = database.length;
    var id; // we need find which index having this id
    if(colInd == 0){
        id = acrossData[rowInd-1].ind;
    }else if(colInd == 1){
        id = downData[rowInd-1].ind;
    }
    var ind = 0;
    for(var i=1;i<len;i++){
        if(database[i].ind === id){
            ind = i;
            break;
        }
    }
    database.splice(ind, 1); // delete the specific data
    updateAcrorssDownData(database);
    hidePopupDel();
    //delete all the table 
    deleteAllTables();
    createAndDisplay(database);
}
// clear all the fields of the popup window
function clearField(direction,clue,data){
    direction.value="";
    clue.value="";
    data.value="";
  }

// insert element into table
function insertElement(){
    var newEntry = {}; // creating new object
    const direction = document.getElementById("direction");
    const clue = document.getElementById("clue");
    const cellData = document.getElementById("data");
    var isValid = true;
    // validity check-----START--------------------------------------
    if(direction.value.toLowerCase() !== "a" && direction.value.toLowerCase() !== "d"){
      alert("Enter proper direction");
      isValid = false;
      clearField(direction,clue,cellData);
    }
    if(isValid && direction.value.toLowerCase() === "a"){
      if(cellData.value.length > numRow-colInd){
        alert("given data will not fit in the table");
        isValid = false;
        clearField(direction,clue,cellData);
      }
    }else{
      if(isValid && cellData.value.length > numCol-rowInd){
        alert("given data will not fit in the table");
        isValid = false;
        clearField(direction,clue,cellData);
      }
    }
    if(isValid && clue.value.length <= 0){
      alert("Clue can't be null");
      isValid = false;
      clearField(direction,clue,cellData);
    }else if(isValid && cellData.value.length <= 0){
      alert("Data can't be null");
      isValid = false;
      clearField(direction,clue,cellData);
    }
    // validity check---END-----------------------------------------
    if(isValid){
      newEntry['ind'] = count;
      count+=1;
      if(direction.value.toLowerCase() === "a"){
        newEntry['dir'] = 0;
      }else{
        newEntry['dir'] = 1;
      }
      newEntry['val'] = cellData.value;
      newEntry['clue'] = clue.value;
      newEntry['rowInd'] = rowInd;
      newEntry['colInd'] = colInd;
      // push that object into the data array
      database.push(newEntry);
      // hide the popup window
      hidePopup();
      clearField(direction,clue,cellData);
      // diplay the answer on the table and also update clue table
      //delete all the table 
        deleteAllTables();
        createAndDisplay(database);
    }
}
// calculate count value 
function calculateCount(){
    var maxCount = 0;
    var len = database.length;
    for(var i=0;i<len;i++){
        if(database[i].ind > maxCount){
            maxCount = database[i].ind;
        }
    }
    count = maxCount+1;
}

ws.addEventListener("message",(e) => {
    newdata = JSON.parse(e.data); // All puzzles
    rowIndexPuzzle = newdata[0]; // index of the puzzle we will modify
    var data = newdata[rowIndexPuzzle+1]; // one specific puzzle
    database = data;
    // calculate maximum count value
    calculateCount();
    numRow = data[0].row;
    numCol = data[0].col;

    // create the clue table and display the index on the crossword table
    createAndDisplay(data);
    // use event listener to get the current cell has been clicked
    var cells = document.querySelectorAll('.cluetd');
    cells.forEach(cell => {
        cell.addEventListener('click', () =>{
            rowInd = cell.closest('tr').rowIndex; // start from 1
            colInd = cell.cellIndex;
            var popup = document.getElementById("popup");
            popup.style.visibility = "visible";
        });
    });

    var dcell = document.querySelectorAll('.data-tab');
    dcell.forEach(cell => {
        cell.addEventListener('click', () =>{
        rowInd = cell.closest('tr').rowIndex;
        colInd = cell.cellIndex;
        // make the popup visible to take the input from user
        var popup = document.getElementById("popup1");
        popup.style.visibility = "visible";
        });
    });
});