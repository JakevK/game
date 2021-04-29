import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.css";

import Game from "./game";

import io from "socket.io-client";

let endpoint = "http://localhost:5000";
let socket = io.connect(endpoint);

const Chatroom = (props) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getMessages();
  }, [messages.length]);

  const getMessages = () => {
    socket.on("message", (msg) => {
      setMessages([
        ...messages,
        (msg.name ? msg.name + ": " : "") + msg.message,
      ]);
    });
  };

  const sendMessage = (message) => {
    socket.emit("message", {
      room: props.room,
      name: props.name,
      message: message,
    });
  };

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  const onClick = () => {
    if (message !== "") {
      sendMessage(message);
      setMessage("");
    }
  };

  return (
    <div>
      <h3>room {props.room}</h3>
      {messages.length > 0 &&
        messages.map((msg) => (
          <div>
            <p>{msg}</p>
          </div>
        ))}
      <input value={message} name="message" onChange={(e) => onChange(e)} />
      <button onClick={onClick}>send</button>
    </div>
  );
};

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
  const [game, setGame] = useState();

  useEffect(() => {
    getGame();
  }, [game]);

  const getGame = () => {
    socket.on("game", (data) => {
      setGame(data);
    });
  };

  const joinGame = (gameCode) => {
    socket.emit("join", { game_code: gameCode, name: name });
  };
  const leaveGame = () => {
    socket.emit("leave", { game_code: game.game_code, name: name });
    setGame();
  };

  const createGame = () => {
    socket.emit("create", { name: name });
  };

  if (game) {
    return <div>{JSON.stringify(game)}</div>;
  }
  if (name) {
    return (
      <div>
        <h3>hello {name}!</h3>
        <p>what would you like to do today?</p>
        <button onClick={createGame}>
          <div>create</div>
          <p>create a new game for your friend to join</p>
        </button>
        <button>
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

ReactDOM.render(<App />, document.getElementById("root"));
