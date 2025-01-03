from app.models.archer import Archer
from app.models.trainer import Trainer

class Club:
    def __init__(self, name, address, phone_number, email):
        self.name = name
        self.address = address
        self.phone_number = phone_number
        self.email = email
        self.archers = []
        self.trainers = []
    
    def add_archer(self, archer):
        self.archers.append(Archer(archer["name"], archer["last_name"], archer["birth_year"], archer["gender"], archer["email"]))
        print(f"Archer added: {archer}")

    def add_trainer(self, trainer):
        self.trainers.append(Trainer(trainer["name"], trainer["last_name"], trainer["email"], trainer["phone_number"], trainer["license_number"]))
        print(f"Trainer added: {trainer}")
    
class ClubRegistry:
    clubs = []

    @classmethod
    def add_club(cls, account):
        cls.clubs.append(account)

    @classmethod
    def find_club_by_name(cls, name):
        for account in cls.accounts:
            if account.email == name:
                return account
        return None