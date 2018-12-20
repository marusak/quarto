const io = require('socket.io')();
const express = require('express');

const app = express();

const winLines = [[0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15],
  [0, 4, 8, 12],
  [1, 5, 9, 13],
  [2, 6, 10, 14],
  [3, 7, 11, 15],
  [0, 5, 10, 15],
  [3, 6, 9, 12],
];

const initBoard = ['field wclf',
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

function testWin(board) {
  for (let i = 0; i < winLines.length; i += 1) {
    const f1 = board[winLines[i][0]];
    const f2 = board[winLines[i][1]];
    const f3 = board[winLines[i][2]];
    const f4 = board[winLines[i][3]];
    if (f1 !== 'field' && f2 !== 'field' && f3 !== 'field' && f4 !== 'field') {
      for (let j = 6; j < 10; j += 1) {
        if (f1[j] === f2[j] && f3[j] === f4[j] && f2[j] === f3[j]) return true;
      }
    }
  }
  return false;
}


class Game {
  constructor() {
    this.players = { one: null, two: null };
    this.player = 'one';
    this.gameSquares = Array(16).fill('field');
    this.stackSquares = initBoard;
    this.selected = -1;
    this.won = false;
  }

  broadcastInGame(key, value) {
    this.players.one.emit(key, value);
    this.players.two.emit(key, value);
  }

  hasFree(socket) {
    if (this.players.one == null) {
      this.players.one = socket;
      this.players.one.on('handleGameBoard', (x, y) => {
        if (this.player !== 'one') {
          return;
        }
        this.handleGameBoard(x, y);
      });
      this.players.one.on('handlePieceBoard', (x, y) => {
        if (this.player !== 'one') {
          return;
        }
        this.handlePieceBoard(x, y);
      });
      this.players.one.emit('stackSquares', initBoard);
      this.players.one.emit('position', 'one');
      return true;
    } if (this.players.two == null) {
      this.players.two = socket;
      this.players.two.on('handleGameBoard', (x, y) => {
        if (this.player !== 'two') {
          return;
        }
        this.handleGameBoard(x, y);
      });
      this.players.two.on('handlePieceBoard', (x, y) => {
        if (this.player !== 'two') {
          return;
        }
        this.handlePieceBoard(x, y);
      });
      this.players.two.emit('stackSquares', initBoard);
      this.players.two.emit('position', 'two');
      this.startGame();
      return true;
    }
    return false;
  }


  startGame() {
    this.broadcastInGame('turn', 'one');
  }

  handleGameBoard(x, y) {
    if (this.won) return;

    if (this.selected === -1) return;

    if (this.gameSquares[x * 4 + y] !== 'field') return;

    this.gameSquares[x * 4 + y] = this.stackSquares[this.selected];
    this.broadcastInGame('gameSquares', this.gameSquares);

    this.stackSquares[this.selected] = 'field';
    this.broadcastInGame('stackSquares', this.stackSquares);

    this.selected = -1;
    this.broadcastInGame('selected', this.selected);

    if (testWin(this.gameSquares)) {
      this.won = true;
      this.broadcastInGame('won', true);
      return;
    } this.won = false;
  }


  handlePieceBoard(x, y) {
    if (this.won) return;

    if (this.selected !== -1) return;

    if (this.stackSquares[x * 4 + y] === 'field') return;

    this.selected = x * 4 + y;
    this.broadcastInGame('selected', this.selected);

    const squares = this.stackSquares.slice().map((old) => {
      const index = old.indexOf('selected');
      if (index !== -1) {
        const lst = old.split(' ');
        lst.pop();
        return lst.join(' ');
      }
      return old;
    });

    squares[x * 4 + y] = `${squares[x * 4 + y]} selected`;
    this.broadcastInGame('stackSquares', squares);
    this.player = this.player === 'one' ? 'two' : 'one';
    this.broadcastInGame('turn', this.player);
  }
}

const games = [new Game()];

io.on('connection', (socket) => {
  if (!games[games.length - 1].hasFree(socket)) {
    games.push(new Game());
    games[games.length - 1].hasFree(socket);
  }

  socket.on('disconnect', () => {
    // TODO remove from game and remove game?
  });
});

const server = app.listen(process.env.PORT || 1337);
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('quarto/build'));
}
io.listen(server);
