from backend import db

class Training(db.Model):
    __tablename__ = 'trainings'
    id = db.Column(db.Integer, primary_key=True)
    quantity_of_shots = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    distance = db.Column(db.Integer, nullable=False)
    archer_id = db.Column(db.Integer, db.ForeignKey('archers.id'), nullable=False)
    archer = db.relationship("Archer", back_populates="trainings")

    def __repr__(self):
        return f"Training('{self.quantity_of_shots}', '{self.date}', '{self.archer_id}')"