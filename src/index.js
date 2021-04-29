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

  return (
    <div>
      <input value={input} onChange={(e) => onChange(e)} />
      <button onClick={() => props.onSubmit(input)}>submit</button>
    </div>
  );
};

const App = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [code, setCode] = useState("");

  const joinRoom = (newRoom) => {
    socket.emit("join", { room: newRoom, name: name });
    setRoom(newRoom);
  };
  const leaveRoom = () => {
    socket.emit("leave", { room: room, name: name });
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
        <Chatroom name={name} room={room} />
      </div>
    );
  } else if (name) {
    return (
      <div>
        <h3>Hello {name}, please enter a code to join a room</h3>
        <input value={code} name="code" onChange={(e) => onCodeChange(e)} />
        <button onClick={onCodeSubmit}>go</button>
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
