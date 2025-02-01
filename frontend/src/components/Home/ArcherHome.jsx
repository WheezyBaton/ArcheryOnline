import { useState, useEffect } from "react";
import ArcherData from "../userDataComponents/ArcherData";
import Login from "../Login";
import Tournament from "../archerComponents/Tournament";
import ArcherSettings from "../archerComponents/ArcherSettings";
import Training from "../archerComponents/Training";
import AcceptInvite from "../AcceptInvite";
import Chat from "../Chat";
import ClubData from "../userDataComponents/ClubData";
import TrainerData from "../userDataComponents/TrainerData";
import "./Home.css";

const Home = ({ email, role }) => {
      const [isLoggedOut, setIsLoggedOut] = useState(false);
      const [activeSection, setActiveSection] = useState("Training");
      const [trainerEmail, setTrainerEmail] = useState(null);
      const [trainerError, setTrainerError] = useState(null);
      const [clubEmail, setClubEmail] = useState(null);
      const [clubError, setClubError] = useState(null);

      useEffect(() => {
            const fetchClubEmail = async () => {
                  try {
                        const response = await fetch(
                              `http://127.0.0.1:5000/archer/${email}/club`,
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

      useEffect(() => {
            const fetchTrainerEmail = async () => {
                  try {
                        const response = await fetch(
                              `http://127.0.0.1:5000/archer/${email}/trainer`,
                              {
                                    method: "GET",
                                    headers: {
                                          "Content-Type": "application/json",
                                    },
                              }
                        );

                        if (response.ok) {
                              const data = await response.json();
                              setTrainerEmail(data.email);
                        } else {
                              const errorData = await response.json();
                              setTrainerError(errorData.message);
                        }
                  } catch (error) {
                        setTrainerError(
                              "An error occurred while fetching trainer email"
                        );
                  }
            };

            fetchTrainerEmail();
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
                                    activeSection === "Tournament"
                                          ? "active"
                                          : ""
                              }`}
                              onClick={() => setActiveSection("Tournament")}
                        >
                              Tournaments
                        </button>
                        <button
                              className={`nav-button ${
                                    activeSection === "Training" ? "active" : ""
                              }`}
                              onClick={() => setActiveSection("Training")}
                        >
                              Trainings
                        </button>
                        <button
                              className={`nav-button ${
                                    activeSection === "Settings" ? "active" : ""
                              }`}
                              onClick={() => setActiveSection("Settings")}
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
                        {trainerEmail && (
                              <button
                                    className={`nav-button ${
                                          activeSection === "TrainerData"
                                                ? "active"
                                                : ""
                                    }`}
                                    onClick={() =>
                                          setActiveSection("TrainerData")
                                    }
                              >
                                    {trainerEmail}
                              </button>
                        )}
                        <button
                              className={`nav-button ${
                                    activeSection === "ArcherData"
                                          ? "active"
                                          : ""
                              }`}
                              onClick={() => setActiveSection("ArcherData")}
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
                        {activeSection === "Tournament" && (
                              <Tournament email={email} />
                        )}
                        {activeSection === "Training" && (
                              <Training email={email} />
                        )}
                        {activeSection === "Settings" && (
                              <ArcherSettings email={email} />
                        )}
                        {activeSection === "ClubData" && (
                              <ClubData email={clubEmail} />
                        )}
                        {activeSection === "TrainerData" && (
                              <TrainerData email={trainerEmail} />
                        )}
                        {activeSection === "ArcherData" && (
                              <ArcherData email={email} />
                        )}
                  </div>
            </div>
      );
};

export default Home;
