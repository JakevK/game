import time
import random
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


def generate_game_code(active):
    code = ''.join(str(random.randint(0, 9)) for i in range(6))
    if code in active:
        return generate_game_code(active)
    return code

@socketio.on('create')
def create(data):
    active_game_codes = [active_game.game_code for active_game in Game.query.all()]
    game_code = generate_game_code(active_game_codes)

    game = Game(
        game_code=game_code,
        player0=data["name"],
        player1=None,
        board="0"*36,
        turn=random.choice([0, 1]),
        stage=0,
        winner=None
    )
    db.session.add(game)
    db.session.commit()
    game_data = {
        "game_code": game.game_code,
        "player0": game.player0,
        "player1": game.player1,
        "board": game.board,
        "turn": game.turn,
        "stage": game.stage,
        "winner": game.winner
    }

    join_room(game_code)
    emit("game", game_data)


if __name__ == "__main__":
    socketio.run(app, debug=True)
