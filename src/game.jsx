import React from "react";

const Board = (props) => (
  <div className="board">
    {props.board.map((quarter, i) => (
      <div
        className="board-quarter"
        key={i}
        style={{ transform: `rotate(${props.rotations[i] * 90}deg)` }}
      >
        {quarter.map((row, j) => (
          <div className="board-row" key={j}>
            {row.map((square, k) => (
              <button
                className="board-square"
                key={k}
                style={{
                  backgroundColor: ["#efefef", "blue", "red"][square],
                }}
                onClick={() => props.onClickSquare(i, j, k)}
              ></button>
            ))}
          </div>
        ))}
      </div>
    ))}
  </div>
);

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      turn: 0,
      winner: 0,
      stage: 0, // 0 = placing, 1 = rotating
      rotations: [0, 0, 0, 0], // * 90deg
      board: [
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
    return (
      <Board
        board={this.state.board}
        rotations={this.state.rotations}
        onClickSquare={(i, j, k) => this.handleClickSquare(i, j, k)}
      />
    );
  }
}

export default Game;
