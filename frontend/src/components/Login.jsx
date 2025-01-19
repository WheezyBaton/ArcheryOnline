import { useState } from "react";
import Home from "./Home";

export default function Login() {
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [token, setToken] = useState(null);
      const [isLoggedIn, setIsLoggedIn] = useState(false);

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

      if (isLoggedIn) {
            return <Home />;
      }

      return (
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
      );
}
