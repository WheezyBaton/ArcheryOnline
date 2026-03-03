# 🎯 ArcheryOnline

ArcheryOnline is a comprehensive web application designed for the archery community. It serves as a digital training log, a platform for tracking tournament results, and a tool for club management and real-time communication.

The application supports three main user roles, adapting the interface and capabilities to their specific needs: **Archer**, **Trainer**, and **Club Manager**.

## ✨ Main Features

### 🏹 Archer
* **Training Log:** Record completed training sessions (date, distance, number of arrows shot).
* **Tournament Results:** Save tournament results categorized by environment (Indoor / Outdoor) and age group (Youth / Adult). The system automatically verifies the validity of entered series and calculates points (including total 10s and 9s).
* **Clubs & Trainers:** Ability to join a club via invitation and be assigned to a specific trainer.

### 📋 Trainer
* **Archer Management:** View a list of assigned archers.
* **Progress Analysis:** Access detailed tournament results and the training history of your athletes.
* **Club Affiliation:** Join archery clubs via real-time invitations.

### 🏢 Club Manager
* **Club Structure Management:** Administer profiles of trainers and archers within the club.
* **Invitation Management:** Send real-time invitations to athletes and trainers to join the club.
* **Relationship Management:** Assign archers to appropriate trainers within the club.

### 💬 Common Features
* **Real-time Chat:** Communication via WebSockets (includes general rooms and role-specific rooms, e.g., a "Trainers only" room).
* **Secure Authorization:** JWT token-based login system with secure password hashing.

---

## 🛠 Technology Stack & Architecture

The project is divided into two independent parts: the API (Backend) and the visual layer (Frontend).

**Frontend (`/frontend` directory)**
* **React.js** (initialized with **Vite**) - used to build the user interface (Single Page Application).
* **CSS3** - component styling.
* **Socket.io-client** - handling real-time communication (chat and live notifications).

**Backend (`/backend` directory)**
* **Python 3 / Flask** - the main application framework.
* **SQLAlchemy** - ORM system for relational database management (SQLite).
* **Flask-SocketIO** - WebSockets server implementation.
* **PyJWT & Flask-Bcrypt** - handling authorization and password encryption.
* **Alembic / Flask-Migrate** - database migration management.

---

## 🚀 Setup Instructions

To run the project locally, you will need **Node.js** (for the frontend) and **Python 3** (for the backend) installed on your system.

### 1. Clone the repository
  ```bash
  git clone [https://github.com/YourUsername/archeryonline.git](https://github.com/YourUsername/archeryonline.git)
  cd archeryonline
  ```

### 2. Backend Setup (API)

Open a new terminal and navigate to the backend folder:

  ```bash
  cd backend
  ```

It is highly recommended to create and activate a virtual environment:

  ```bash
  # Create a virtual environment
  python -m venv venv
  
  # Activate (Windows)
  venv\Scripts\activate
  # Activate (macOS/Linux)
  source venv/bin/activate
  ```

Install the required dependencies (make sure you have a `requirements.txt` file, or manually install `flask`, `flask_sqlalchemy`, `flask_socketio`, `flask_bcrypt`, `pyjwt`, `flask_migrate`):

  ```bash
  pip install -r requirements.txt
  ```

Run the Flask server (by default it listens on `http://127.0.0.1:5000`):

  ```bash
  flask run
  # OR
  python api.py
  ```

### 3. Frontend Setup

Open a new terminal and navigate to the frontend folder:

  ```bash
  cd frontend
  ```

Install the required NPM packages:

  ```bash
  npm install
  ```

Start the Vite development server:

  ```bash
  npm run dev
  ```

The application will be available in your browser at the address provided by Vite in the console (usually `http://localhost:5173`).
