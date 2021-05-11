import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.css";

import io from "socket.io-client";

let endpoint =
  window.location.hostname +
  ":" +
  (window.location.port === "5000" ? window.location.port : "");
console.log("bruh");
console.log(endpoint);
let socket = io.connect(endpoint);

const StringInput = (props) => {
  const [input, setInput] = useState("");
  const onChange = (e) => {
    setInput(e.target.value);
  };
  const onKeyUp = (e) => {
    if (e.keyCode === 13) {
      props.onSubmit(input);
    }
  };

  return (
    <div>
      <input
        value={input}
        onKeyUp={(e) => onKeyUp(e)}
        onChange={(e) => onChange(e)}
      />
      <button onClick={() => props.onSubmit(input)}>submit</button>
    </div>
  );
};

const App = () => {
  const [name, setName] = useState("");
  const [playerNum, setPlayerNum] = useState();
  const [game, setGame] = useState();
  const [joining, setJoining] = useState(0);

  useEffect(() => {
    getGame();
    getGameEnd();
  }, []);

  const getGame = () => {
    socket.on("game", (data) => {
      setGame(data);
      setJoining(0);
    });
  };
  const getGameEnd = () => {
    socket.on("game_over", (data) => {
      setGame();
    });
  };

  const joinGame = (gameCode) => {
    if (gameCode.length === 6) {
      socket.emit("join", { game_code: gameCode, name: name });
      setPlayerNum(1);
    }
  };
  const leaveGame = () => {
    socket.emit("leave", { game_code: game.game_code, name: name });
    setGame();
  };

  const createGame = () => {
    socket.emit("create", { name: name });
    setPlayerNum(0);
  };

  if (game) {
    if (game.player1) {
      return (
        <Game
          data={game}
          playerNum={playerNum}
          name={name}
          leaveGame={leaveGame}
        />
      );
    }
    return (
      <div>
        <h3>Your game code is</h3>
        <div>{game.game_code}</div>
      </div>
    );
  }
  if (joining) {
    return (
      <div>
        <h3>enter a code to join a game</h3>
        <StringInput onSubmit={(output) => joinGame(output)} />
      </div>
    );
  }
  if (name) {
    return (
      <div>
        <h3>hello {name}!</h3>
        <p>what would you like to do today?</p>
        <button onClick={() => createGame()}>
          <div>create</div>
          <p>create a new game for your friend to join</p>
        </button>
        <button onClick={() => setJoining(1)}>
          <div>join</div>
          <p>join an existing game with a game code</p>
        </button>
      </div>
    );
  } else {
    return (
      <div>
        <h3>what's your name?</h3>
        <StringInput onSubmit={(output) => setName(output)} />
      </div>
    );
  }
};

const Board = (props) => (
  <div className="board">
    {props.board.map((quarter, i) => (
      <div
        className="board-quarter"
        key={i}
        style={{
          transform: `rotate(${props.rotations.split(",")[i] * 90}deg)`,
        }}
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

const Game = (props) => {
  const chunkSplit = (str, len) =>
    str.match(new RegExp(".{1," + len + "}", "g"));

  const placePiece = (i, j, k) => {
    if (
      props.data.turn === props.playerNum &&
      props.data.stage === 0 &&
      props.data.winner === null
    ) {
      let index = i * 9 + j * 3 + k;
      if (props.data.board[index] === "0") {
        socket.emit("place", {
          game_code: props.data.game_code,
          index: index,
          player_num: props.playerNum,
        });
      }
    }
  };
  const rotateQuarter = (quarter, rotation) => {
    socket.emit("rotate", {
      game_code: props.data.game_code,
      player_num: props.playerNum,
      quarter: quarter,
      rotation: rotation,
    });
  };

  return (
    <div>
      <button onClick={() => props.leaveGame()}>leave game</button>
      <h3>
        playing as{" "}
        <span style={{ color: ["blue", "red"][props.playerNum] }}>
          {props.name}
        </span>
      </h3>
      <div>
        {props.data.winner === null
          ? props.data.turn === props.playerNum
            ? props.data.stage
              ? "turn a quarter"
              : "place a piece"
            : "opponent's turn"
          : props.data.winner === props.playerNum
          ? "you won!"
          : "you lost :("}
      </div>
      {props.data.stage && props.data.turn === props.playerNum ? (
        <div className="controls">
          <div className="rotate-top-left">
            <button onClick={() => rotateQuarter(0, -1)}>{"<-"}</button>
            <button onClick={() => rotateQuarter(0, 1)}>{"->"}</button>
          </div>
          <div className="rotate-top-right">
            <button onClick={() => rotateQuarter(1, -1)}>{"<-"}</button>
            <button onClick={() => rotateQuarter(1, 1)}>{"->"}</button>
          </div>
        </div>
      ) : (
        <div className="controls"></div>
      )}
      <Board
        board={chunkSplit(props.data.board, 9).map((quarter) =>
          chunkSplit(quarter, 3).map((row) => row.split("").map((x) => +x))
        )}
        rotations={props.data.rotations}
        onClickSquare={(i, j, k) => placePiece(i, j, k)}
      />
      {props.data.stage && props.data.turn === props.playerNum ? (
        <div className="controls">
          <div className="rotate-bottom-left">
            <button onClick={() => rotateQuarter(2, 1)}>{"<-"}</button>
            <button onClick={() => rotateQuarter(2, -1)}>{"->"}</button>
          </div>
          <div className="rotate-bottom-right">
            <button onClick={() => rotateQuarter(3, 1)}>{"<-"}</button>
            <button onClick={() => rotateQuarter(3, -1)}>{"->"}</button>
          </div>
        </div>
      ) : (
        <div className="controls"></div>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
