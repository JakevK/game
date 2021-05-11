import random
import os
from flask import Flask, send_from_directory, request
from flask_socketio import SocketIO, send, emit, join_room, leave_room

from models import *


# configure app
app = Flask(__name__, static_folder='client/build')
app.secret_key = 'dont forget this you idiot'

# configure database
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
db = SQLAlchemy(app)

# initialize flask-socketio
socketio = SocketIO(app, cors_allowed_origins="*")


# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


@socketio.on('join')
def join(data):
    game = db.session.query(GameTable).filter_by(
        game_code=data["game_code"]).first()
    if game and not game.player1:
        join_room(data["game_code"])
        game.player1 = data["name"]
        db.session.commit()
        game_data = {
            "game_code": game.game_code,
            "player0": game.player0,
            "player1": data["name"],
            "board": game.board,
            "rotations": game.rotations,
            "turn": game.turn,
            "stage": game.stage,
            "winner": game.winner
        }
        emit("game", game_data, room=data["game_code"])


@socketio.on('leave')
def leave(data):
    game = db.session.query(GameTable).filter_by(
        game_code=data["game_code"]).first()
    if game:
        db.session.delete(game)
        db.session.commit()
        emit("game_over", room=data["game_code"])
        leave_room(data["game_code"])


@socketio.on('disconnect')
def disconnect():
    print(request.sid)
    print('\n\n\n\nDISCONNECTED')


def generate_game_code(active):
    code = ''.join(str(random.randint(0, 9)) for i in range(6))
    if code in active:
        return generate_game_code(active)
    return code


@socketio.on('create')
def create(data):
    print('\n'*10)
    print('---------------surely---------------')
    active_game_codes = [
        active_game.game_code for active_game in GameTable.query.all()]
    game_code = generate_game_code(active_game_codes)

    game = GameTable(
        game_code=game_code,
        player0=data["name"],
        player1=None,
        board="0"*36,
        rotations="0,0,0,0",
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
        "rotations": game.rotations,
        "turn": game.turn,
        "stage": game.stage,
        "winner": game.winner
    }

    join_room(game_code)
    emit("game", game_data)


@socketio.on('place')
def place(data):
    game = db.session.query(GameTable).filter_by(game_code=data["game_code"])
    game = game.first()

    if game.stage == 0 and data["player_num"] == game.turn and game.board[data["index"]] == "0" and game.winner == None:
        game.board = game.board[:data["index"]] + \
            str(game.turn+1) + game.board[data["index"]+1:]
        game.stage = 1
        db.session.commit()
        game_data = {
            "game_code": game.game_code,
            "player0": game.player0,
            "player1": game.player1,
            "board": game.board,
            "rotations": game.rotations,
            "turn": game.turn,
            "stage": game.stage,
            "winner": game.winner
        }
        emit("game", game_data, room=data["game_code"])


def cycle(quarter, key):
    first = quarter[key[0]]
    for i in range(len(key)-1):
        quarter[key[i]] = quarter[key[i+1]]
    quarter[key[-1]] = first
    return quarter


def rotate_quarter(quarter, rotation):
    quarter = list(quarter)
    cycles = [
        [],
        [[3, 7, 5, 1], [6, 8, 2, 0]],
        [[0, 8], [2, 6], [1, 7], [5, 3]],
        [[1, 5, 7, 3], [0, 2, 8, 6]]
    ]
    for key in cycles[rotation]:
        quarter = cycle(quarter, key)

    return ''.join(quarter)


def rotate_board(board, rotations):
    result = ""
    for i, rotation in enumerate(rotations):
        result += rotate_quarter(board[i*9:(i+1)*9], rotation % 4)
    return result


def check_for_win(board, rotations):
    board = rotate_board(board, [int(rotation)
                         for rotation in rotations.split(',')])
    board = [int(val) for val in list(board)]
    board = [[[*half[i:i+3], *half[i+9:i+12]]
              for i in range(0, 9, 3)] for half in [board[0:18], board[18:36]]]
    board = [*board[0], *board[1]]

    def check_row(row):
        if len(set(row[0:5])) == 1:
            return row[0]
        if len(row) <= 5:
            return 0
        return check_row(row[1:])

    checks = [
        *board,
        *[[x[i] for x in board] for i in range(6)],
        *[
            [board[i][i] for i in range(6)],
            [board[i+1][i] for i in range(5)],
            [board[i][i+1] for i in range(5)],
        ],
        *[
            [board[i][5-i] for i in range(6)],
            [board[i][4-i] for i in range(5)],
            [board[i][6-i] for i in range(1, 6)]
        ]
    ]
    for check in checks:
        winner = check_row(check)
        if winner:
            return winner-1

    return None


@socketio.on('rotate')
def rotate(data):
    game = db.session.query(GameTable).filter_by(game_code=data["game_code"])
    game = game.first()

    if game.stage == 1 and data["player_num"] == game.turn and game.winner == None:
        game.rotations = ','.join(quarter if i != data["quarter"] else str(int(
            quarter) + data["rotation"]) for i, quarter in enumerate(game.rotations.split(',')))
        game.winner = check_for_win(game.board, game.rotations)

        if game.winner == None:
            game.turn = 1 - game.turn
        game.stage = 0
        db.session.commit()

        game_data = {
            "game_code": game.game_code,
            "player0": game.player0,
            "player1": game.player1,
            "board": game.board,
            "rotations": game.rotations,
            "turn": game.turn,
            "stage": game.stage,
            "winner": game.winner
        }
        emit("game", game_data, room=data["game_code"])


if __name__ == "__main__":
    socketio.run(app, debug=True)
