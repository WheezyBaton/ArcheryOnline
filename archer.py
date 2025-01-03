class Archer:
    def __init__(self, name, last_name, birth_year, gender, email,license_number = None, shots = None, chord = None):
        self.name = name
        self.last_name = last_name
        self.birth_year = birth_year
        self.gender = gender
        self.license_number = license_number
        self.email = email
        self.shots = shots
        self.chord = chord
        self.trainings = []
        self.tournaments = []
    
    def add_trainig(self, quantity_of_shots, distance):
        date = date.now()
        self.trainings.append((quantity_of_shots, date, distance))
        print(f"Training added: {quantity_of_shots} shots at {distance}m on {date}")
    
    def add_license(self, license_number):
        self.license_number = license_number
        print(f"License added: {license_number}")
    
    def add_shots(self, name, model, tip_weight, length, hard, parameter, data_purchased, quantity, wear = 0):
        self.shots = [name, model, tip_weight, length, hard, parameter, data_purchased, quantity, wear]
        print(f"Shots added: {self.shots}")

    def add_chord(self, data_purchased, quantity, wear = 0):
        self.chord = [data_purchased, quantity, wear]
        print(f"Chord added: {self.chord}")

    def add_tournament(self, distance, score):
        date = date.now()
        self.tournaments.append((date, distance, score))
        print(f"Tournament added at {distance}m on {date} with score {score}")

class AccountsRegistry:
    accounts = []

    @classmethod
    def add_account(cls, account):
        cls.accounts.append(account)

    @classmethod
    def find_account_by_email(cls, email):
        for account in cls.accounts:
            if account.email == email:
                return account
        return None
