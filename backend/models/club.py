from backend import db, bcrypt

class Club(db.Model):
    __tablename__ = 'clubs'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(50), nullable=False)
    phone_number = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    archers = db.relationship("Archer", back_populates="club")
    trainers = db.relationship("Trainer", back_populates="club")
    password_hash = db.Column(db.String(128), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False)
    role = db.relationship('Role', backref=db.backref('clubs', lazy=True))

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def __repr__(self):
        return f"Club('{self.name}', '{self.address}', '{self.phone_number}', '{self.email}')"