import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class Board extends React.Component {
    renderRow(i){
        return [
            <button className={this.props.value[i*4+0]} onClick={() => this.props.onClick(i,0)} />,
            <button className={this.props.value[i*4+1]} onClick={() => this.props.onClick(i,1)} />,
            <button className={this.props.value[i*4+2]} onClick={() => this.props.onClick(i,2)} />,
            <button className={this.props.value[i*4+3]} onClick={() => this.props.onClick(i,3)} />,
        ]
    }

    render() {
        return(
            React.createElement(
                'div',
                {className: 'col-md-6'},
                React.createElement(
                    'div',
                    {className:'board-row'},
                    this.renderRow(0)
                ),
                React.createElement(
                    'div',
                    {className:'board-row'},
                    this.renderRow(1)
                ),
                React.createElement(
                    'div',
                    {className:'board-row'},
                    this.renderRow(2)
                ),
                React.createElement(
                    'div',
                    {className:'board-row'},
                    this.renderRow(3)
                ),
            )
        );
    };
}

class Game extends React.Component {
    initial_board = ['field wclf',
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
    ]

    win_lines = [[0,1,2,3],
                 [4,5,6,7],
                 [8,9,10,11],
                 [12,13,14,15],
                 [0,4,8,12],
                 [1,5,9,13],
                 [2,6,10,14],
                 [3,7,11,15],
                 [0,5,10,15],
                 [3,6,9,12],
    ]

    testWin(board) {
        for (var i = 0; i < this.win_lines.length; i++){
            var f1 = board[this.win_lines[i][0]];
            var f2 = board[this.win_lines[i][1]];
            var f3 = board[this.win_lines[i][2]];
            var f4 = board[this.win_lines[i][3]];
            if (f1 === 'field' || f2 === 'field' || f3 === 'field' || f4 === 'field')
                continue;
            for (var j=6; j < 10; j++){
                if (f1[j] === f2[j] && f3[j] === f4[j] && f2[j] === f3[j])
                    return true;
            }
        }
        return false;
    }

    constructor(props){
        super(props);
        this.state = {
          gameSquares: Array(16).fill('field'),
          stackSquares: this.initial_board,
          selected: -1,
          moveFirst: true,
          status: "Player one selects piece",
          won: false,
        };
    }

    handleGameBoard = (x,y) => {
        if (this.state.won)
            return;
        if (!this.state.selected === -1)
            return;
        if (this.state.gameSquares[x*4+y] !== 'field')
            return;
        const gameSquares = this.state.gameSquares.slice();
        const stackSquares = this.state.stackSquares.slice();
        var lst = stackSquares[this.state.selected].split(" ")
        lst.pop();
        stackSquares[this.state.selected] = "field";
        gameSquares[x*4+y] = lst.join(" ");
        if (this.state.moveFirst)
            var status = "Player one selects piece";
        else
            var status = "Player two selects piece";

        if (this.testWin(gameSquares)){
            if (this.state.moveFirst)
                var status = "Player one won!";
            else
                var status = "Player two won!";
            var won = true;
        } else
            var won = false;


        this.setState({
            gameSquares: gameSquares,
            stackSquares: stackSquares,
            selected: -1,
            status: status,
            won: won,
        });

    };

    handlePiecesBoard = (x,y) => {
        if (this.state.won)
            return;
        if (this.state.selected !== -1)
            return;
        if (this.state.stackSquares[x*4+y] === 'field')
            return;

        if (this.state.moveFirst)
            var status = "Player two places piece";
        else
            var status = "Player one places piece";


        this.setState({
            selected: x*4+y,
            moveFirst: !this.state.moveFirst,
            status: status,
        });

        const squares = this.state.stackSquares.slice().map(function(old){
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
        this.setState({
            stackSquares: squares,
        });
    };

    render() {
        return (
            <div className='container'>
                <div className='row'>
                    {this.state.status}
                </div>
                <div className='row'>
                    <Board onClick={this.handleGameBoard} value={this.state.gameSquares}/>
                    <Board onClick={this.handlePiecesBoard} value={this.state.stackSquares}/>
                </div>
            </div>
        )
    };
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
