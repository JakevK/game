import time
from flask import Flask
from flask_socketio import SocketIO, send, emit, join_room, leave_room

from models import *


# configure app
app = Flask(__name__)
app.secret_key = 'dont forget this you idiot'


# configure database
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://iubxdwstqunann:76db314dd0bb1c848ebbc5b937e89a967227a05b4246be85a72d31988e664c58@ec2-34-233-0-64.compute-1.amazonaws.com:5432/d2329mu19ucsgr'
db = SQLAlchemy(app)

# initialize flask-socketio
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route('/time')
def get_current_time():
    return {'time': time.time()}


@socketio.on('message')
def message(data):
    send({"message": data["message"], "name": data["name"]}, room=data["room"])


@socketio.on('join')
def join(data):
    join_room(data["room"])
    send({'message': data["name"] + ' joined the room'}, room=data["room"])


@socketio.on('leave')
def leave(data):
    leave_room(data["room"])
    send({'message': data["name"] + ' left the room'}, room=data["room"])


if __name__ == "__main__":
    socketio.run(app, debug=True)
