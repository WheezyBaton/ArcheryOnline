import { useState } from "react";
import App from "./../App";
import AddArcher from "./archerComponents/AddArcher";
import AddClub from "./clubComponents/AddClub";
import AddTrainer from "./trainerComponents/AddTrainer";
import "./Login.css";

export default function Login() {
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [token, setToken] = useState(null);
      const [isLoggedIn, setIsLoggedIn] = useState(false);
      const [showAddArcher, setShowAddArcher] = useState(false);
      const [showAddClub, setShowAddClub] = useState(false);
      const [showAddTrainer, setShowAddTrainer] = useState(false);

      const handleLogin = async (e) => {
            e.preventDefault();

            const response = await fetch("http://127.0.0.1:5000/login", {
                  method: "POST",
                  headers: {
                        "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ email, password }),
            });

            console.log(response);

            if (response.ok) {
                  const data = await response.json();
                  setToken(data.access_token);
                  localStorage.setItem("token", data.access_token);
                  setIsLoggedIn(true);
            } else {
                  alert("Invalid credentials");
            }
      };

      const handleSignUpClick = () => {
            setShowAddArcher(true);
            setShowAddClub(false);
            setShowAddTrainer(false);
      };

      const handleAddClubClick = () => {
            setShowAddArcher(false);
            setShowAddClub(true);
            setShowAddTrainer(false);
      };

      const handleAddTrainerClick = () => {
            setShowAddArcher(false);
            setShowAddClub(false);
            setShowAddTrainer(true);
      };

      if (isLoggedIn) {
            return <App />;
      }

      return (
            <div className="content">
                  <div className="login">
                        <form className="loginContent" onSubmit={handleLogin}>
                              <input
                                    className="loginInput"
                                    type="text"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                              />
                              <input
                                    className="loginInput"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) =>
                                          setPassword(e.target.value)
                                    }
                              />
                              <button className="nav-button" type="submit">
                                    Login
                              </button>
                        </form>
                        <div className="buttons">
                              <button
                                    className="nav-button"
                                    onClick={handleSignUpClick}
                              >
                                    Add Archer
                              </button>
                              <button
                                    className="nav-button"
                                    onClick={handleAddClubClick}
                              >
                                    Add Club
                              </button>
                              <button
                                    className="nav-button"
                                    onClick={handleAddTrainerClick}
                              >
                                    Add Trainer
                              </button>
                        </div>
                  </div>
                  {showAddArcher && <AddArcher />}
                  {showAddClub && <AddClub />}
                  {showAddTrainer && <AddTrainer />}
            </div>
      );
}
