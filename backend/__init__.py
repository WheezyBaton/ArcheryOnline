from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_cors import CORS

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////Users/sebastianblaszczyk/studia/ArcheryOnline/backend/data/database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['SECRET_KEY'] = 'your_secret_key'
app.config['JWT_COOKIE_NAME'] = 'access_token'
CORS(app, supports_credentials=True)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt()

from backend.routes.archer_routes import *
from backend.routes.club_routes import *
from backend.routes.trainer_routes import *
from backend.routes.tournament_routes import *
from backend.routes.training_routes import *
from backend.routes.login_routes import *