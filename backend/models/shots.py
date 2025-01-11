from backend import db

class Shots(db.Model):
    __tablename__ = 'shots'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    model = db.Column(db.String, nullable=False)
    tip_weight = db.Column(db.Float, nullable=False)
    length = db.Column(db.Float, nullable=False)
    hard = db.Column(db.Integer, nullable=False)
    parameter = db.Column(db.String, nullable=False)
    data_purchased = db.Column(db.DateTime, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    wear = db.Column(db.Integer, nullable=True)
    id_archer = db.Column(db.Integer, db.ForeignKey('archers.id'), nullable=True)
    archer = db.relationship("Archer", back_populates="shots")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "model": self.model,
            "tip_weight": self.tip_weight,
            "length": self.length,
            "hard": self.hard,
            "parameter": self.parameter,
            "data_purchased": self.data_purchased,
            "quantity": self.quantity,
            "wear": self.wear,
            "archer_id": self.id_archer
        }

    def __repr__(self):
        return f"Shots('{self.name}', '{self.model}', '{self.data_purchased}')"