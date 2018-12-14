import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Board extends React.Component {
    renderRow(i){
        return [
            React.createElement('button', {key: i + '1', className:'field'}),
            React.createElement('button', {key: i + '2', className:'field'}),
            React.createElement('button', {key: i + '3', className:'field'}),
            React.createElement('button', {key: i + '4', className:'field'}),
        ]
    }

    render() {
        return(
            React.createElement(
                'div',
                {},
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
  render() {
    return <Board />;
  };
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
