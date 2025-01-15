import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend import app, db
from backend.models.role import Role

with app.app_context():
    db.create_all()

    if not Role.query.filter_by(name="Club Manager").first():
        club_manager = Role(name="Club Manager")
        db.session.add(club_manager)

    if not Role.query.filter_by(name="Trainer").first():
        trainer = Role(name="Trainer")
        db.session.add(trainer)

    if not Role.query.filter_by(name="Archer").first():
        archer = Role(name="Archer")
        db.session.add(archer)

    db.session.commit()

if __name__ == "__main__":
    app.run(debug=True)