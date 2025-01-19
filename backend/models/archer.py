from backend import db, bcrypt

class Archer(db.Model):
    __tablename__ = 'archers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(15), nullable=False)
    last_name = db.Column(db.String(15), nullable=False)
    birth_year = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(1), nullable=False)
    license_number = db.Column(db.String(4), nullable=True)
    email = db.Column(db.String(30), nullable=False)
    trainings = db.relationship("Training", back_populates="archer")
    tournaments = db.relationship("Tournament", back_populates="archer")
    trainer_id = db.Column(db.Integer, db.ForeignKey('trainers.id'), nullable=True)
    trainer = db.relationship("Trainer", back_populates="archers")
    club_id = db.Column(db.Integer, db.ForeignKey('clubs.id'), nullable=True)
    club = db.relationship("Club", back_populates="archers")
    password_hash = db.Column(db.String(128), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False)
    role = db.relationship('Role', backref=db.backref('archers', lazy=True))

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"Archer('{self.name}', '{self.last_name}', '{self.birth_year}')"