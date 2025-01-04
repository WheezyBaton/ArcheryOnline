from flask import Flask
from app.routes.archer_routes import *
from app.routes.club_routes import *
from app.routes.tournament_routes import *
from app import app

if __name__ == "__main__":
    app.run(debug=True)