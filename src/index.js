import { getByPlaceholderText } from "@testing-library/dom";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      turn: 0,
    };
  }

  handleClickSquare(i, j) {
    if (!this.state.squares[i][j]) {
      let squaresTemp = this.state.squares;
      squaresTemp[i][j] = this.state.turn + 1;
      const newTurn = 1 - this.state.turn;
      this.setState({ squares: squaresTemp, turn: newTurn });
      this.props.handleTurnChange(newTurn);
    }
  }

  render() {
    const board = this.state.squares.map((row, i) => {
      const squares = row.map((square, j) => {
        const squareColor = ["white", "blue", "red"][square];
        const squareStyle = {
          backgroundColor: squareColor,
        };
        return (
          <button
            style={squareStyle}
            className="board-square"
            key={j}
            onClick={() => this.handleClickSquare(i, j)}
          >
            {square}
          </button>
        );
      });
      return (
        <div className="board-row" key={i}>
          {squares}
        </div>
      );
    });
    const boardStyle = {
        border: `3px solid ${["blue", "red"][this.state.turn]}`
    }
    return <div className="board" style={boardStyle}>{board}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      turn: 0,
    };
  }
  handleTurnChange(turn) {
    this.setState({ turn: turn });
  }
  render() {
    const turnColor = ["blue", "red"][this.state.turn];
    const turnColorStyle = {
      color: turnColor,
      fontWeight: "bold",
    };
    return (
      <div className="container">
        <div className="turnIndicator">
          <span style={turnColorStyle}>{turnColor}</span> player's turn
        </div>
        <Board handleTurnChange={(turn) => this.handleTurnChange(turn)} />
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
