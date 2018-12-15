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
    constructor(props){
        super(props);
        this.state = {
          gameSquares: Array(16).fill('field'),
          stackSquares: Array(16).fill('field'),
        };
    }

    handleGameBoard = (x,y) => {
    };

    handlePiecesBoard = (x,y) => {
        const squares = this.state.stackSquares.slice();
        squares[x*4+y] = 'field selected';
        this.setState({
            stackSquares: squares,
        });
    };

    render() {
        return (
            <div className='container'>
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
