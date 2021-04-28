import time
from flask import Flask
from flask_socketio import SocketIO, send, emit, join_room, leave_room


# configure app
app = Flask(__name__)


# initialize flask-socketio
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route('/time')
def get_current_time():
    return {'time': time.time()}


@socketio.on('message')
def message(data):
    print(data)
    send(data["message"], room=data["room"])


@socketio.on('join')
def join(data):
    join_room(data["room"])
    send('joined room ' + data["room"])


@socketio.on('leave')
def leave(data):
    leave_room(data["room"])
    send('left room ' + data["room"])
