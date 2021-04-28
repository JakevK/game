import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.css";

import Game from "./game";

import io from "socket.io-client";

let endpoint = "http://localhost:5000";
let socket = io.connect(endpoint);

const Chatroom = (props) => {
  const [messages, setMessages] = useState(["welcome"]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getMessages();
  }, [messages.length]);

  const getMessages = () => {
    socket.on("message", (msg) => {
      setMessages([...messages, msg]);
    });
  };

  const sendMessage = (message) => {
    socket.emit("message", { room: props.room, message: message });
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

const App = () => {
  const [room, setRoom] = useState("");
  const [code, setCode] = useState("");

  const joinRoom = (newRoom) => {
    socket.emit("join", { room: newRoom });
    setRoom(newRoom);
  };
  const leaveRoom = () => {
    socket.emit("leave", { room: room });
    setRoom("");
  };

  const onCodeChange = (e) => {
    setCode(e.target.value);
  };
  const onCodeSubmit = () => {
    if (code.length === 6) {
      joinRoom(code);
    }
  };

  if (room) {
    return (
      <div>
        <button onClick={leaveRoom}>leave</button>
        <Chatroom room={room} />
      </div>
    );
  }
  return (
    <div>
      <h3>enter a code to join a room</h3>
      <input value={code} name="code" onChange={(e) => onCodeChange(e)} />
      <button onClick={onCodeSubmit}>go</button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
