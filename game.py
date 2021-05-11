import random
from api import db, GameTable

class Game:
    def __init__(self, game_code=self.generate_code()):
        record = db.session.query(Game).filter_by(game_code=self.game_code).first()

        self.game_code = record.game_code 
        self.player1 = record.player1 
        self.player2 = record.player2 
        self.board = record.board 
        self.rotations = record.rotations 
        self.turn = record.turn 
        self.stage = record.stage 
        self.winner = record.winner 

    def read_data(self):
        pass
    
    def generate_code(self):
        return "111111"

    def new_game_setup(self):
        self.board = "0"*36
        self.rotations = "0,0,0,0"
        self.turn = random.choice([0, 1])
        self.stage = 0
        self.winner = None

    def add_player(self, new_player):
        if self.player1:
            self.player2 = new_player
        else:
            self.player1 = new_player
        
    def save(self):
        if not self.player1:
            raise "a game must have a player to be saved"

        record = db.session.query(Game).filter_by(game_code=self.game_code).first()
