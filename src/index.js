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
      winner: 0,
    };
  }

  checkForWin() {
    const checkRow = (row) =>
      new Set(row.slice(0, 5)).size === 1
        ? row[0]
        : row.length <= 5
        ? 0
        : checkRow(row.slice(1));

    const squares = this.state.squares;

    const checks = [
      ...squares,
      ...[...Array(6).keys()].map((n) => squares.map((row) => row[n])),
      ...[squares, squares.slice(1), squares.map((x) => x.slice(1))].map((x) =>
        x.map((row, i) => row[i])
      ),
      ...[
        squares,
        squares.slice(1),
        squares.map((x) => x.slice(0, 5)),
      ].map((x) => x.map((row, i) => row[row.length - 1 - i])),
    ];

    for (let i = 0; i < checks.length; i++) {
      let winner = checkRow(checks[i]);
      if (winner) return winner;
    }

    return 0;
  }

  handleClickSquare(i, j) {
    if (!this.state.squares[i][j] && !this.state.winner) {
      let squaresTemp = this.state.squares;
      squaresTemp[i][j] = this.state.turn + 1;

      const newTurn = 1 - this.state.turn;
      const winner = this.checkForWin();

      this.setState({
        squares: squaresTemp,
        turn: newTurn,
        winner: winner,
      });

      this.props.handleTurnChange(newTurn, winner);
    }
  }

  render() {
    const board = this.state.squares.map((row, i) => {
      const squares = row.map((square, j) => {
        const squareColor = ["#efefef", "blue", "red"][square];
        const squareStyle = {
          backgroundColor: squareColor,
        };
        return (
          <button
            style={squareStyle}
            className="board-square"
            key={j}
            onClick={() => this.handleClickSquare(i, j)}
          ></button>
        );
      });
      return (
        <div className="board-row" key={i}>
          {squares}
        </div>
      );
    });
    const boardStyle = {
      border: `3px solid ${
        ["blue", "red"][
          this.state.winner ? this.state.winner - 1 : this.state.turn
        ]
      }`,
    };
    return (
      <div className="board" style={boardStyle}>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      turn: 0,
      winner: 0,
    };
  }
  handleTurnChange(turn, winner) {
    this.setState({ turn: turn, winner: winner });
  }
  render() {
    const turnColor = ["blue", "red"][this.state.turn];
    const winnerColor = ["blue", "red"][this.state.winner - 1];
    const turnColorStyle = {
      color: turnColor,
      fontWeight: "bold",
    };
    const winnerColorStyle = {
      color: winnerColor,
      fontWeight: "bold",
    };
    const turnIndicator = this.state.winner ? (
      <div className="turnIndicator">
        <span style={winnerColorStyle}>{winnerColor}</span> won!
      </div>
    ) : (
      <div className="turnIndicator">
        <span style={turnColorStyle}>{turnColor}</span> player's turn
      </div>
    );
    return (
      <div className="container">
        {turnIndicator}
        <Board
          handleTurnChange={(turn, winner) =>
            this.handleTurnChange(turn, winner)
          }
        />
      </div>
    );
  }
}

//============================================================

ReactDOM.render(<Game />, document.getElementById("root"));
