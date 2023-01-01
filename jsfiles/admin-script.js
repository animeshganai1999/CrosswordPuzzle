
var numRow = 0;
var numCol = 0;
var colInd, rowInd;
var data = [];
var count = 1;
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

// used to hide the popup window
function hidePopup() {
  const popup = document.getElementById("popup");
  popup.style.visibility = "hidden";
}

// clear all the fields of the popup window
function clearField(direction,clue,data){
  direction.value="";
  clue.value="";
  data.value="";
}

function backToDelmonPage(){
  location.href = "/adminDelmod";
}

// display data on the table
function displayDataOnTable(newEntry){
  const table = document.getElementById("tab");
  var data = newEntry.val;
  var len = data.length;
  if(newEntry.dir === 0){ // across the table (row number is fixed)
    for(var i=0;i<len;i++){
      const cell = table.rows[newEntry.rowInd].cells[newEntry.colInd + i];
      cell.style.backgroundColor = "white";
      cell.style.textAlign = "center";
      cell.innerText = data[i];
    }
  }else{ // down the table (column number is fixed)
    for(var i=0;i<len;i++){
      const cell = table.rows[newEntry.rowInd+i].cells[newEntry.colInd];
      cell.style.backgroundColor = "white";
      cell.style.textAlign = "center";
      cell.innerText = data[i];
    }
  }
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
    data.push(newEntry);
    // hide the popup window
    hidePopup();
    // diplay the answer on the table
    displayDataOnTable(newEntry);
    clearField(direction,clue,cellData);
  }
}

// generate the table cells 
function generateTable(){
  const div1 = document.getElementById('div1');
  // creating table element
  const table = document.createElement("table");
  table.setAttribute('id', "tab") // assigning id to the table
  // appending rows in the table 
  for (var i = 0; i < numRow; i++) {
    table.appendChild(createEmptyTableRowObj(numCol));
  }
  table.classList.add("crossword-table");
  div1.appendChild(table);

  // make the save button visible
  const save = document.getElementById('save');
  save.classList.remove("hide");
  const back = document.getElementById('back');
  back.classList.remove("hide");
}


// creating the table when number of rows and columns given
function createTable(){
  const row = document.getElementById("numRow");
  numRow = row.value;
  const col = document.getElementById("numCol");
  numCol = col.value;

  data.push({"row":numRow, "col":numCol});

  // make the input of the table size invisible
  const rowcol = document.getElementById("rowcol");
  rowcol.classList.add("hide");
  // call the below function to generate the table
  generateTable();

  // insert element into the table by clicking on the table cell
  // const table = document.getElementById("tab");
  const cells = document.querySelectorAll('td');
  cells.forEach(cell => {
    cell.addEventListener('click', () =>{
      rowInd = cell.closest('tr').rowIndex;
      colInd = cell.cellIndex;
      // make the popup visible to take the input from user
      var popup = document.getElementById("popup");
      popup.style.visibility = "visible";
    });
  });

}

const ws = new WebSocket("ws://localhost:8082");
ws.binaryType = "arraybuffer";
var database;
ws.addEventListener("message",(e) => {
  if(e.data.byteLength !== 0){
    database = JSON.parse(e.data);
  }
});

// save the puzzle in the database
function saveThePuzzle(){
  if(count<2){
    alert("Atleast there must be one data in the puzzle");
    return;
  }
  database.push(data);
  var jsonData = JSON.stringify(database);
  ws.send(jsonData);
  location.href = "/adminDelmod";
  // location.replace("./../public/admin-delmod.html")
}
