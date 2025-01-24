import "./App.css";
import Login from "./components/Login";
import ArcherHome from "./components/ArcherHome";
//import TrainerHome from "./components/TrainerHome";
import ClubHome from "./components/ClubHome";
import { useState, useEffect } from "react";

function App() {
      const [isAuthenticated, setIsAuthenticated] = useState(false);
      const [loading, setLoading] = useState(true);
      const [role, setRole] = useState(null);

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
                              setRole(data.user.role); // Odczytaj rolę użytkownika z odpowiedzi
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

      // Renderuj komponent na podstawie roli użytkownika
      switch (role) {
            case "Archer":
                  return <ArcherHome />;
            // case "Trainer":
            //  return <TrainerHome />;
            case "Club Manager":
                  return <ClubHome />;
            default:
                  return <div>Unknown role</div>; // Obsługa przypadku, gdy rola jest nieznana
      }
}

export default App;
