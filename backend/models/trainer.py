class Trainer:
    def __init__(self, name, last_name, email, phone_number, license_number):
        self.name = name
        self.last_name = last_name
        self.email = email
        self.phone_number = phone_number
        self.license_number = license_number
        self.archers = []
        self.club_name = None

class TrainerRegistry:
    trainers = []

    @classmethod
    def add_trainer(cls, trainer):
        cls.trainers.append(trainer)

    @classmethod
    def find_trainer_by_email(cls, email):
        for trainer in cls.trainers:
            if trainer.email == email:
                return trainer
        return None