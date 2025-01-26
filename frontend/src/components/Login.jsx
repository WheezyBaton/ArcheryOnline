import { useState } from "react";
import App from "./../App";
import AddArcher from "./archerComponents/AddArcher";
import AddClub from "./clubComponents/AddClub";
import AddTrainer from "./trainerComponents/AddTrainer";

export default function Login() {
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [token, setToken] = useState(null);
      const [isLoggedIn, setIsLoggedIn] = useState(false);
      const [isSignUp, setIsSignUp] = useState(false);
      const [isAddClub, setIsAddClub] = useState(false);
      const [isAddTrainer, setIsAddTrainer] = useState(false);

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
            setIsSignUp(true);
      };

      const handleAddClubClick = () => {
            setIsAddClub(true);
      };

      const handleAddTrainerClick = () => {
            setIsAddTrainer(true);
      };

      if (isLoggedIn) {
            return <App />;
      }

      if (isSignUp) {
            return <AddArcher />;
      }

      if (isAddClub) {
            return <AddClub />;
      }

      if (isAddTrainer) {
            return <AddTrainer />;
      }

      return (
            <div>
                  <form onSubmit={handleLogin}>
                        <input
                              type="text"
                              placeholder="Email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                              type="password"
                              placeholder="Password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">Login</button>
                  </form>
                  <button onClick={handleSignUpClick}>Załóż Konto</button>
                  <button onClick={handleAddClubClick}>Dodaj Klub</button>
                  <button onClick={handleAddTrainerClick}>Dodaj Trenera</button>
            </div>
      );
}
