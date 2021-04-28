import React from "react";
import ReactDOM from "react-dom";
import "./index.css";


  checkForWin(boardToCheck) {
    const checkRow = (row) =>
      new Set(row.slice(0, 5)).size === 1
        ? row[0]
        : row.length <= 5
        ? 0
        : checkRow(row.slice(1));

    const squares = [
      ...boardToCheck[0].map((x, i) => [...x, ...boardToCheck[1][i]]),
      ...boardToCheck[2].map((x, i) => [...x, ...boardToCheck[3][i]]),
    ];

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

  handleClickSquare(k, i, j) {
    if (
      !this.state.squares[k][i][j] &&
      !this.state.winner &&
      !this.state.stage
    ) {
      let squaresTemp = this.state.squares;
      squaresTemp[k][i][j] = this.state.turn + 1;

      this.setState({
        squares: squaresTemp,
      });

      this.state.handleStageChange();
    }
  }

  rotateQuarter(quarter, direction) {
    let newRotations = [...this.state.rotations];
    newRotations[quarter] += direction ? 1 : -1;
    /*
    let newQuarter = [...this.state.squares[quarter]];
    if (direction) {
      newQuarter = [...Array(3).keys()].map((n) =>
        newQuarter.map((row) => row[n]).reverse()
      );
    } else {
      newQuarter = 
    }
*/

    const rotateMatrix = (matrix, rotation) => {
      console.log(rotation);
      if (rotation === 1) {
        return [...Array(3).keys()].map((n) =>
          matrix.map((row) => row[n]).reverse()
        );
      }
      if (rotation === 2) {
        return matrix.map((x) => [...x].reverse()).reverse();
      }
      if (rotation === 3) {
        return [...Array(3).keys()]
          .reverse()
          .map((n) => matrix.map((row) => row[n]));
      }
      return matrix;
    };
    const rotatedBoard = [...this.state.squares].map((x, i) =>
      rotateMatrix(x, ((newRotations[i] % 4) + 4) % 4)
    );
    console.log(rotatedBoard);

    const newTurn = 1 - this.state.turn;
    const winner = this.checkForWin(rotatedBoard);

    this.setState({
      rotations: newRotations,
    });

    this.state.handleTurnChange(newTurn, winner);
    this.state.handleStageChange();
  }

  render() {
    const board = this.state.squares.map((quarter, k) => {
      const rows = quarter.map((row, i) => {
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
              onClick={() => this.handleClickSquare(k, i, j)}
            ></button>
          );
        });
        return (
          <div className="board-row" key={i}>
            {squares}
          </div>
        );
      });
      const quarterStyle = {
        transform: `rotate(${this.state.rotations[k] * 90}deg)`,
      };
      return (
        <div className="board-quarter" key={k} style={quarterStyle}>
          {rows}
        </div>
      );
    });
    return (
      <div>
        {this.state.stage ? (
          <div className="controls">
            <div className="rotate-top-left">
              <button onClick={() => this.rotateQuarter(0, 0)}>{"<-"}</button>
              <button onClick={() => this.rotateQuarter(0, 1)}>{"->"}</button>
            </div>
            <div className="rotate-top-right">
              <button onClick={() => this.rotateQuarter(1, 0)}>{"<-"}</button>
              <button onClick={() => this.rotateQuarter(1, 1)}>{"->"}</button>
            </div>
          </div>
        ) : (
          <div className="controls"></div>
        )}
        <div className="board" style={boardStyle}>
          {board}
        </div>
        {this.state.stage ? (
          <div className="controls">
            <div className="rotate-bottom-left">
              <button onClick={() => this.rotateQuarter(2, 1)}>{"<-"}</button>
              <button onClick={() => this.rotateQuarter(2, 0)}>{"->"}</button>
            </div>
            <div className="rotate-bottom-right">
              <button onClick={() => this.rotateQuarter(3, 1)}>{"<-"}</button>
              <button onClick={() => this.rotateQuarter(3, 0)}>{"->"}</button>
            </div>
          </div>
        ) : (
          <div className="controls"></div>
        )}
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
      stage: 0,
      rotations: [0, 0, 0, 0],
      squares: [
        [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
        [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
        [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
        [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
      ],
    };
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
    const instructions = this.state.winner ? (
      <div className="instruction"></div>
    ) : (
      <div className="instructions">
        {["place a piece", "rotate a quarter"][this.state.stage]}
      </div>
    );
    return (
      <div className="container">
        {turnIndicator}
        {instructions}
        <Board
          handleTurnChange={(turn, winner) =>
            this.setState({ turn: turn, winner: winner })
          }
          handleStageChange={() =>
            this.setState({ stage: 1 - this.state.stage })
          }
          turn={this.state.turn}
          winner={this.state.winner}
          stage={this.state.stage}
        />
      </div>
    );
  }
}

//============================================================

ReactDOM.render(<Game />, document.getElementById("root"));
