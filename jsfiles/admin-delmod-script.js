const wss = new WebSocket("ws://localhost:8082");
wss.binaryType = "arraybuffer";

wss.addEventListener("message",(e) => {
    // console.log(e.data);
    const divEle = document.getElementById("old-puzzles");
    var data = JSON.parse(e.data);
    var len = data.length;

    const table = document.createElement("table");

    for(var i=1;i<len;i++){
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        td2.classList.add("delete");
        td2.innerText = "Delete";
        var td3 = document.createElement("td");
        td3.classList.add("modify");
        td3.innerText = "Modify";
        td1.innerText = "Puzzle-"+i;
        // td.appendChild(btn);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        table.appendChild(tr);
    }
    divEle.appendChild(table);
    const cells = document.querySelectorAll('td');
    cells.forEach(cell => {
        cell.addEventListener('click', () =>{
            rowInd = cell.closest('tr').rowIndex;
            colInd = cell.cellIndex;
            if(colInd === 1){ // delete the puzzle
                data.splice(rowInd+1,1); // delete the specific row (puzzle)
                // console.log(data);
                wss.send(JSON.stringify(data)); // send data back to server
                location.href = "./../public/admin-delmod.html";
            }else if(colInd === 2){ // modify the puzzle
                data[0] = rowInd;
                wss.send(JSON.stringify(data)); // send data back to server
                location.href = "./../public/modify.html";
            }
        });
    });
    const btn1 = document.getElementById("btn1");
    btn1.addEventListener("click",(e)=>{
        location.href = "./../public/admin.html";
    });
    const btn2 = document.getElementById("btn2");
    btn2.addEventListener("click",(e)=>{
        location.href = "./../public/index.html";
    });
});