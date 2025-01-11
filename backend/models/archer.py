from backend import db

class Archer(db.Model):
    __tablename__ = 'archers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(15), nullable=False)
    last_name = db.Column(db.String(15), nullable=False)
    birth_year = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(1), nullable=False)
    license_number = db.Column(db.String(4), nullable=True)
    email = db.Column(db.String(30), nullable=False)
    shots = db.relationship("Shots", back_populates="archer")
    chord = db.relationship("Chord", back_populates="archer", uselist=True)
    trainings = db.relationship("Training", back_populates="archer")
    tournaments = db.relationship("Tournament", back_populates="archer")
    trainer_id = db.Column(db.Integer, db.ForeignKey('trainers.id'), nullable=True)
    trainer = db.relationship("Trainer", back_populates="archers")
    club_id = db.Column(db.Integer, db.ForeignKey('clubs.id'), nullable=True)
    club = db.relationship("Club", back_populates="archers")

    def __repr__(self):
        return f"Archer('{self.name}', '{self.last_name}', '{self.birth_year}')"