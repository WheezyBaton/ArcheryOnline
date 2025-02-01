import { useState, useEffect } from "react";
import ArcherList from "../ArcherList";
import Login from "../Login";
import ChangeTrainer from "../trainerComponents/ChangeTrainer";
import TrainerData from "../userDataComponents/TrainerData";
import AcceptInvite from "../AcceptInvite";
import ClubData from "../userDataComponents/ClubData";
import Chat from "../Chat";
import "./Home.css";

const TrainerHome = ({ email, role }) => {
      const [isLoggedOut, setIsLoggedOut] = useState(false);
      const [activeSection, setActiveSection] = useState("TrainerData");
      const [clubEmail, setClubEmail] = useState(null);
      const [clubError, setClubError] = useState(null);

      useEffect(() => {
            const fetchClubEmail = async () => {
                  try {
                        const response = await fetch(
                              `http://127.0.0.1:5000/trainer/${email}/club`,
                              {
                                    method: "GET",
                                    headers: {
                                          "Content-Type": "application/json",
                                    },
                              }
                        );

                        if (response.ok) {
                              const data = await response.json();
                              setClubEmail(data.email);
                        } else {
                              const errorData = await response.json();
                              setClubError(errorData.message);
                        }
                  } catch (error) {
                        setClubError(
                              "An error occurred while fetching club email"
                        );
                  }
            };

            fetchClubEmail();
      }, [email]);

      const handleLogout = () => {
            localStorage.removeItem("token");
            setIsLoggedOut(true);
      };

      if (isLoggedOut) {
            return <Login />;
      }

      return (
            <div className="home-container">
                  <AcceptInvite />
                  <div className="button-container">
                        <button
                              className={`nav-button ${
                                    activeSection === "Chat" ? "active" : ""
                              }`}
                              onClick={() => setActiveSection("Chat")}
                        >
                              Chat
                        </button>
                        <button
                              className={`nav-button ${
                                    activeSection === "ArcherList"
                                          ? "active"
                                          : ""
                              }`}
                              onClick={() => setActiveSection("ArcherList")}
                        >
                              Archers
                        </button>
                        <button
                              className={`nav-button ${
                                    activeSection === "ChangeTrainer"
                                          ? "active"
                                          : ""
                              }`}
                              onClick={() => setActiveSection("ChangeTrainer")}
                        >
                              Settings
                        </button>
                        {clubEmail && (
                              <button
                                    className={`nav-button ${
                                          activeSection === "ClubData"
                                                ? "active"
                                                : ""
                                    }`}
                                    onClick={() => setActiveSection("ClubData")}
                              >
                                    {clubEmail}
                              </button>
                        )}
                        <button
                              className={`nav-button ${
                                    activeSection === "TrainerData"
                                          ? "active"
                                          : ""
                              }`}
                              onClick={() => setActiveSection("TrainerData")}
                        >
                              {email}
                        </button>
                        <button
                              className="logout-button"
                              onClick={handleLogout}
                        >
                              Logout
                        </button>
                  </div>

                  <div className="content">
                        {activeSection === "Chat" && (
                              <Chat userEmail={email} userRole={role} />
                        )}
                        {activeSection === "ArcherList" && (
                              <ArcherList email={email} role={role} />
                        )}
                        {activeSection === "ChangeTrainer" && (
                              <ChangeTrainer email={email} />
                        )}
                        {activeSection === "ClubData" && (
                              <ClubData email={clubEmail} />
                        )}
                        {activeSection === "TrainerData" && (
                              <TrainerData email={email} />
                        )}
                  </div>
            </div>
      );
};

export default TrainerHome;
