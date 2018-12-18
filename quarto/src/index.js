import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import io from 'socket.io-client';

class Board extends React.Component {
  renderRow(i) {
    return [
      <button className={this.props.value[i * 4 + 0]} onClick={() => this.props.onClick(i, 0)} />,
      <button className={this.props.value[i * 4 + 1]} onClick={() => this.props.onClick(i, 1)} />,
      <button className={this.props.value[i * 4 + 2]} onClick={() => this.props.onClick(i, 2)} />,
      <button className={this.props.value[i * 4 + 3]} onClick={() => this.props.onClick(i, 3)} />,
    ];
  }

  render() {
    return (
      React.createElement(
        'div',
        { className: 'col-md-6' },
        React.createElement(
          'div',
          { className: 'board-row' },
          this.renderRow(0),
        ),
        React.createElement(
          'div',
          { className: 'board-row' },
          this.renderRow(1),
        ),
        React.createElement(
          'div',
          { className: 'board-row' },
          this.renderRow(2),
        ),
        React.createElement(
          'div',
          { className: 'board-row' },
          this.renderRow(3),
        ),
      )
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameSquares: Array(16).fill('field'),
      stackSquares: Array(16).fill('field'),
      selected: -1,
      status: 'Waiting for opponent to connect',
      position: null,
      turn: null,
      socket: io.connect(),
    };
    this.state.socket.on('turn', (who) => {
      let status = '';
      if (this.state.selected === -1) {
        if (this.state.position === who) status = 'Pick piece for opponent to place';
        else status = 'Opponent is selecting piece for you to place';
      } else if (this.state.position === who) status = 'Place selected piece';
      else status = 'Opponent is placing selected piece';
      this.setState({
        status,
        turn: who,
      });
    });

    this.state.socket.on('stackSquares', (board) => {
      this.setState({ stackSquares: board });
    });

    this.state.socket.on('gameSquares', (board) => {
      this.setState({ gameSquares: board });
    });

    this.state.socket.on('position', (pos) => {
      this.setState({ position: pos });
    });

    this.state.socket.on('won', (won) => {
      if (won) {
        let status = 'You lost!';
        if (this.state.turn === this.state.position) status = 'You won!';
        this.setState({ status });
      }
    });

    this.state.socket.on('selected', (selected) => {
      let status = '';
      if (selected === -1) {
        if (this.state.position === this.state.turn) status = 'Pick piece for opponent to place';
        else status = 'Opponent is selecting piece for you to place';
      } else if (this.state.position === this.state.turn) status = 'Place selected piece';
      else status = 'Opponent is placing selected piece';
      this.setState({
        status,
        selected,
      });
    });
  }

    handleGameBoard = (x, y) => this.state.socket.emit('handleGameBoard', x, y);

    handlePiecesBoard = (x, y) => this.state.socket.emit('handlePieceBoard', x, y);

    render() {
      return (
        <div className="container">
          <div className="row">
            {this.state.status}
          </div>
          <div className="row">
            <Board onClick={this.handleGameBoard} value={this.state.gameSquares} />
            <Board onClick={this.handlePiecesBoard} value={this.state.stackSquares} />
          </div>
        </div>
      );
    }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root'),
);
