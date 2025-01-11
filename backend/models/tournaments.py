from backend import db

class Tournament(db.Model):
    __tablename__ = 'tournaments'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False)
    type = db.Column(db.String(50), nullable=False)
    distance = db.Column(db.Float, nullable=False)
    total_score = db.Column(db.Integer, nullable=False)
    series = db.Column(db.JSON, nullable=False)
    archer_id = db.Column(db.Integer, db.ForeignKey('archers.id'), nullable=False)
    archer = db.relationship("Archer", back_populates="tournaments")

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date,
            "type": self.type,
            "distance": self.distance,
            "total_score": self.total_score,
            "series": self.series,
            "archer_id": self.archer_id
        }