import { useState } from "react";
import ClubData from "../userDataComponents/ClubData";
import Login from "../Login";
import ChangeClub from "../clubComponents/ChangeClub";
import Member from "../clubComponents/Member";
import "./Home.css";
import Chat from "../Chat";

const ClubHome = ({ email, role }) => {
      const [isLoggedOut, setIsLoggedOut] = useState(false);
      const [activeSection, setActiveSection] = useState("ClubData");

      const handleLogout = () => {
            localStorage.removeItem("token");
            setIsLoggedOut(true);
      };

      if (isLoggedOut) {
            return <Login />;
      }

      return (
            <div className="home-container">
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
                                    activeSection === "Member" ? "active" : ""
                              }`}
                              onClick={() => setActiveSection("Member")}
                        >
                              Members
                        </button>
                        <button
                              className={`nav-button ${
                                    activeSection === "ChangeClub"
                                          ? "active"
                                          : ""
                              }`}
                              onClick={() => setActiveSection("ChangeClub")}
                        >
                              Settings
                        </button>
                        <button
                              className={`nav-button ${
                                    activeSection === "ClubData" ? "active" : ""
                              }`}
                              onClick={() => setActiveSection("ClubData")}
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
                        {activeSection === "Member" && (
                              <Member email={email} role={role} />
                        )}
                        {activeSection === "ChangeClub" && (
                              <ChangeClub email={email} />
                        )}
                        {activeSection === "ClubData" && (
                              <ClubData email={email} />
                        )}
                  </div>
            </div>
      );
};

export default ClubHome;
