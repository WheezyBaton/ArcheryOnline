import "./App.css";
import Login from "./components/Login";
import ArcherHome from "./components/archerComponents/ArcherHome";
import TrainerHome from "./components/trainerComponents/TrainerHome";
import ClubHome from "./components/clubComponents/ClubHome";
import { useState, useEffect } from "react";

function App() {
      const [isAuthenticated, setIsAuthenticated] = useState(false);
      const [loading, setLoading] = useState(true);
      const [role, setRole] = useState(null);
      const [user_id, setUser_id] = useState(null);
      const [email, setEmail] = useState(null);
      const [birth_date, setBirth_date] = useState(null);

      useEffect(() => {
            const token = localStorage.getItem("token");
            console.log("Token from localStorage:", token);

            if (token) {
                  fetch("http://127.0.0.1:5000/protected", {
                        method: "GET",
                        headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                        },
                        credentials: "include",
                  })
                        .then((response) => {
                              if (response.ok) {
                                    return response.json();
                              } else {
                                    throw new Error("Invalid or expired token");
                              }
                        })
                        .then((data) => {
                              console.log("Protected data:", data);
                              setIsAuthenticated(true);
                              setRole(data.user.role);
                              setUser_id(data.user.id);
                              setEmail(data.user.email);
                              setBirth_date(data.user.birth_date);
                        })
                        .catch((error) => {
                              console.error("Error:", error);
                              setIsAuthenticated(false);
                        })
                        .finally(() => {
                              setLoading(false);
                        });
            } else {
                  setLoading(false);
            }
      }, []);

      if (loading) {
            return <div>Loading...</div>;
      }

      if (!isAuthenticated) {
            return <Login />;
      }

      switch (role) {
            case "Archer":
                  return <ArcherHome email={email} />;
            case "Trainer":
                  return <TrainerHome email={email} role={role} />;
            case "Club Manager":
                  return <ClubHome email={email} role={role} />;
            default:
                  return <div>Unknown role</div>;
      }
}

export default App;
