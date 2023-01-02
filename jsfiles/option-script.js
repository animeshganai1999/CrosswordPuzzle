const serverAddress = "wss://famous-wasp-mittens.cyclic.app/";
// const wss = new WebSocket(serverAddress);
const wss = new WebSocket("ws://localhost:8082");

wss.binaryType = "arraybuffer";
var rowIndexPuzzle;
var serverDataO;
function buttonEvent(){
    location.href = "/";
}
wss.addEventListener("message",(e) => {
    // alert(e.data);
    // console.log(e.data);
    var eData = JSON.parse(e.data);
    console.log(eData);
    if(e.data.byteLength === 0 || eData.length === 1){ // means there are no data in the server
        const hEleO = document.createElement("h2");
        hEleO.innerText = "OOPS! No Puzzle to play";

        hEleO.style.color = "red";
        hEleO.style.fontSize = "50px";
        hEleO.style.fontFamily = "Arial, Helvetica, sans-serif";

        const btnO = document.createElement("button");
        btnO.innerText = "Back to the main page";
        btnO.style.fontSize = "25px";
        btnO.style.padding = "10px";
        btnO.style.border = "3px solid black";
        btnO.style.borderRadius = "10px";

        var bodyEleO = document.getElementById("body");
        console.log(bodyEleO);
        bodyEleO.appendChild(hEleO);
        bodyEleO.appendChild(btnO);

        btnO.onclick = function(){
            location.href = "/";
        }

    }else{
        const div = document.getElementById("div2");
        div.classList.remove("make_invisible");

        var data = JSON.parse(e.data);
        var serverDataO = data;
        // console.log(data);
        // console.log(serverDataO);
        var lenO = serverDataO.length;
        const divEleO = document.getElementById("div");
        const tabO = document.createElement("table");

        for(var i=1;i<lenO;i++){
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            var btn = document.createElement("button");
            td.innerText = "Puzzle-"+i;
            // td.appendChild(btn);
            tr.appendChild(td);
            tabO.appendChild(tr);
        }
        divEleO.appendChild(tabO);
        const cells = document.querySelectorAll('td');

        cells.forEach(cell => {
            cell.addEventListener('click', () =>{
            rowIndexPuzzle = cell.closest('tr').rowIndex;
            console.log(rowIndexPuzzle);
            data[0] = rowIndexPuzzle;
            console.log(data);
            wss.send(JSON.stringify(data)); // send data back to server
            location.href = "/user";
            });
        });
    }
});
