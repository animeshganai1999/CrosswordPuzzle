const WebSocket = require("ws");

const wss = new WebSocket.Server({port:8082});
var jsonData = [
    0,
    [
      { row: '8', col: '10'},
      {
        ind: 1,
        dir: 0,
        val: 'kolkata',
        clue: 'capital of west bangal',
        rowInd: 0,
        colInd: 0
      },
      {
        ind: 2,
        dir: 1,
        val: 'kohima',
        clue: 'Capital of nagaland',
        rowInd: 0,
        colInd: 3
      },
      {
        ind: 3,
        dir: 0,
        val: 'imphal',
        clue: 'Capital of Manipur',
        rowInd: 3,
        colInd: 3
      },
      {
        ind: 4,
        dir: 1,
        val: 'jaipur',
        clue: 'Capital of Rajasthan',
        rowInd: 2,
        colInd: 7
      }
    ],
    [
      { row: '5', col: '5' },
      {
        ind: 1,
        dir: 0,
        val: 'oct',
        clue: 'Month before November:Abbr',
        rowInd: 0,
        colInd: 1
      },
      {
        ind: 2,
        dir: 0,
        val: 'sable',
        clue: 'Weasel like animal',
        rowInd: 2,
        colInd: 0
      },
      {
        ind: 3,
        dir: 1,
        val: 'cabal',
        clue: 'Scheming group',
        rowInd: 0,
        colInd: 2
      },
      {
        ind: 4,
        dir: 1,
        val: 'less',
        clue: 'Not as costly',
        rowInd: 1,
        colInd: 4
      }
    ]
];

wss.on("connection", ws => {
    ws.on("message",message=>{
        jsonData = JSON.parse(message);
        // console.log(jsonData);
    });

    ws.on("close",function(){
        console.log("I lost a client");
    });

    ws.send(JSON.stringify(jsonData));
    
    console.log("one more client connected");
});