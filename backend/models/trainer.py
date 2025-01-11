from backend import db

class Trainer(db.Model):
    __tablename__ = 'trainers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    phone_number = db.Column(db.String(50), nullable=False)
    license_number = db.Column(db.String(50), nullable=False)
    archers = db.relationship("Archer", back_populates="trainer")
    club_id = db.Column(db.Integer, db.ForeignKey('clubs.id'), nullable=True)
    club = db.relationship("Club", back_populates="trainers")

    def __repr__(self):
        return f"Trainer('{self.name}', '{self.last_name}', '{self.email}', '{self.phone_number}', '{self.license_number}')"