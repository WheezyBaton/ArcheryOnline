from flask import Flask
from backend.routes.archer_routes import *
from backend.routes.club_routes import *
from backend.routes.tournament_routes import *
from backend import app

if __name__ == "__main__":
    app.run(debug=True)