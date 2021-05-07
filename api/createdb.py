from flask import Flask
from flask_sqlalchemy import SQLAlchemy



app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = #########
db = SQLAlchemy(app)

class Game(db.Model):
    """ game model """

    __tablename__ = "games"

    id = db.Column(db.Integer, primary_key=True)
    game_code = db.Column(db.String(6), unique=True, nullable=False) # unique code for joining a game
    player0 = db.Column(db.String(25), nullable=False) # name of player
    player1 = db.Column(db.String(25)) # name of player
    board = db.Column(db.String(36), nullable=False) # string of all square values joined
    rotations = db.Column(db.String(), nullable=False)
    turn = db.Column(db.Integer, nullable=False) # 0 or 1 for player 0 or 1
    stage = db.Column(db.Integer, nullable=False) # 0 or 1 for placing or spinning
    winner = db.Column(db.Integer) # 0 or 1, null if no winner

