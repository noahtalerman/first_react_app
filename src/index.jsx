import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {
    let className;
    if (props.winningSquares && props.winningSquares.indexOf(props.index) !== -1) {
      className = "square winner"
    } else {
      className = "square"
    }
    return (
      <button className={className} onClick={props.onClick}>
        {props.value}
      </button>
    )
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square
            index={i}
            key={`square-${i}`}
            value={this.props.squares[i]}
            winningSquares={this.props.winningSquares} 
            onClick={() => this.props.onClick(i)}
        />
      );
    }

    createGrid() {
      let grid = [];
      let idx = 0;
      for (let i = 0; i < 3; ++i) {
        let row = [];
        for (let j = 0; j < 3; ++j) {
          row.push(this.renderSquare(idx))
          idx++;
        }
        grid.push(<div key={`row-${i}`} className="board-row">{row}</div>);
      }
      return grid;
    }
  
    render() {
      return (
        <div>
          {this.createGrid()}
        </div>
      );
    }
  }

  function Info(props) {
    const history = props.history;
    const current = history[props.stepNumber];
    const winner = calculateWinner(current.squares);
    let moves = history.map((step, move) => {
      const desc = move ?
      'Go to move #' + move :
      'Go to game start';
      const locations = { 0: [1, 1], 1: [1, 2], 2: [1, 3], 3: [2, 1], 4: [2, 2], 
                          5: [2, 3], 6: [3, 1], 7: [3, 2], 8: [3, 3], }
      const currentSquare = history[move]['stepSquare'];
      const currentLocation = locations[currentSquare];
      const location = currentLocation ? `Row ${currentLocation[0]}, Column ${currentLocation[1]}` : '';
      if (move === props.stepNumber) {
        return (
          <li key={move}>
            <button onClick={() => props.jumpTo(move)}><strong>{desc}</strong></button>
            <span className="location"><strong>{location}</strong></span>
          </li>
        );
      } else {
        return (
          <li key={move}>
            <button onClick={() => props.jumpTo(move)}>{desc}</button>
            <span className="location">{location}</span>
          </li>
        );
      }
    });

    let status;
    moves = props.infoFlipped ? moves.reverse() : moves;
    let olAttribute = props.infoFlipped ? true : false
    if (winner) {
      status = 'Winner: ' + winner[0];

    } else if (props.isDraw) {
      status = 'Draw'
    } else {
      status = 'Next player: ' + (props.xIsNext ? 'X' : 'O');
    }
      return (
          <div className="game-info">
            <div>{status}</div>
            <ol reversed={olAttribute} >{moves}</ol>
            <button onClick={() => props.flipMoves()}>Toggle List</button>
          </div>
      );
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          stepSquare: null,
          squares: Array(9).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,
        infoFlipped: false,
      }
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1]
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        console.log(squares[i])
        return;
      }
      squares[i] = this.state.xIsNext ? 'X': 'O';
      this.setState({
        history: history.concat([{
            stepSquare: i,
            squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    flipMoves() {
      this.setState({
        infoFlipped:!this.state.infoFlipped,
      })
    }

    renderList() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      let isDraw = false;
      if (current.squares.every((square) => {return square !== null}) && calculateWinner(current.squares) === null) {
        isDraw = true;
      }
      return (
        <Info
          history={this.state.history}
          stepNumber={this.state.stepNumber}
          jumpTo={(step) => this.jumpTo(step)}
          xIsNext={this.state.xIsNext}
          infoFlipped={this.state.infoFlipped}
          flipMoves={() => this.flipMoves()}
          isDraw={isDraw}
        />
      );
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winningSquares = calculateWinner(current.squares)? calculateWinner(current.squares).slice(1) : null;
      return (
        <div className="game">
          <div className="game-board">
            <Board
              winningSquares={winningSquares}
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          {this.renderList()}
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [squares[a], a, b, c];
      }
    }
    return null;
  }