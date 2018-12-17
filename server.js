const io = require('socket.io')()

let win_lines = [[0,1,2,3],
                 [4,5,6,7],
                 [8,9,10,11],
                 [12,13,14,15],
                 [0,4,8,12],
                 [1,5,9,13],
                 [2,6,10,14],
                 [3,7,11,15],
                 [0,5,10,15],
                 [3,6,9,12],
];

var init_board = ['field wclf',
                  'field wclh',
                  'field wcsf',
                  'field wcsh',
                  'field wslf',
                  'field wslh',
                  'field wssf',
                  'field wssh',
                  'field bclf',
                  'field bclh',
                  'field bcsf',
                  'field bcsh',
                  'field bslf',
                  'field bslh',
                  'field bssf',
                  'field bssh',
];

const players = {'one': null, 'two': null};
let player = 'one';
let gameSquares = Array(16).fill('field');
let stackSquares = Array(16).fill('field');
let selected = -1;
let won = false;

function testWin(board) {
    for (var i = 0; i < win_lines.length; i++){
        var f1 = board[win_lines[i][0]];
        var f2 = board[win_lines[i][1]];
        var f3 = board[win_lines[i][2]];
        var f4 = board[win_lines[i][3]];
        if (f1 === 'field' || f2 === 'field' || f3 === 'field' || f4 === 'field')
            continue;
        for (var j=6; j < 10; j++){
            if (f1[j] === f2[j] && f3[j] === f4[j] && f2[j] === f3[j])
                return true;
        }
    }
    return false;
}


function reset() {
  gameSquares = Array(16).fill('field');
  stackSquares = init_board;
  selected = -1;
  won = false;
  players['one'] = null;
  players['two'] = null;
  player = 'one';
}

io.on('connection', function (socket) {
  if (players['one'] == null) {
    players['one'] = socket
    socket.emit('position', 'one')
  } else if (players['two'] == null) {
    players['two'] = socket
    io.emit('stackSquares', init_board);
    socket.emit('position', 'two')
    io.emit('turn', 'one')
  } else {
    socket.disconnect()
  }

  socket.on('disconnect', function () {
    if (players['one'] === socket) {
      players['one'] = null
    } else if (players['two'] === socket) {
      players['two'] = null
    }
  })

  socket.on('handleGameBoard', function (x, y) {
    if (players[player] !== socket) {
      return;
    }

    if ((players['one'] == null) || (players['two'] == null)) {
      return;
    }

    if (won)
        return;

    if (selected === -1)
        return;

    if (gameSquares[x*4+y] !== 'field')
        return;

    gameSquares[x*4+y] = stackSquares[selected];
    io.emit('gameSquares', gameSquares);

    stackSquares[selected] = "field";
    io.emit('stackSquares', stackSquares);

    selected = -1;
    io.emit('selected', selected);

    if (testWin(gameSquares)){
        won = true;
        io.emit('won', true)
        return;
    } else
        won = false;
  });


  socket.on('handlePieceBoard', function (x, y) {
    if (players[player] !== socket) {
      return;
    }

    if ((players['one'] == null) || (players['two'] == null)) {
      return;
    }

    if (won)
        return;

    if (selected !== -1)
        return;

    if (stackSquares[x*4+y] === 'field')
        return;

    selected = x*4+y;
    io.emit('selected', selected);

    const squares = stackSquares.slice().map(function(old){
        var index = old.indexOf('selected');
        if (index !== -1){
            var lst = old.split(" ")
            lst.pop();
            return lst.join(" ");
        }
        else
            return old;
    });

    squares[x*4+y] = squares[x*4+y] + ' selected';
    io.emit('stackSquares', squares);
    player = player === "one" ? "two" : "one";
    io.emit('turn', player);
  });

})

reset()
const port = 1337
io.listen(port)
console.log('Listening on port ' + port + '...')
