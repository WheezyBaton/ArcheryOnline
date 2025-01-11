from backend import db

class Club(db.Model):
    __tablename__ = 'clubs'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(50), nullable=False)
    phone_number = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    archers = db.relationship("Archer", back_populates="club")
    trainers = db.relationship("Trainer", back_populates="club")

    def __repr__(self):
        return f"Club('{self.name}', '{self.address}', '{self.phone_number}', '{self.email}')"