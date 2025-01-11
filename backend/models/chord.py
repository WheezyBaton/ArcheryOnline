from backend import db

class Chord(db.Model):
    __tablename__ = 'chords'
    id = db.Column(db.Integer, primary_key=True)
    data_purchased = db.Column(db.DateTime, nullable=False)
    wear = db.Column(db.Integer, nullable=False)
    id_archer = db.Column(db.Integer, db.ForeignKey('archers.id'), nullable=True)
    archer = db.relationship("Archer", back_populates="chord", uselist=False)

    def to_dict(self):
        return {
            "id": self.id,
            "data_purchased": self.data_purchased.isoformat() if self.data_purchased else None, 
            "wear": self.wear,
            "archer_id": self.id_archer
        }

    def __repr__(self):
        return f"Chord('{self.data_purchased}', '{self.wear}', '{self.id_archer}')"