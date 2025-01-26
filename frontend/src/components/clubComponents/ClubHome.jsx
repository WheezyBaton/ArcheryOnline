import { useState } from "react";
import ClubData from "./ClubData";
import AssignArcher from "./AssignArcher";
import AssignTrainer from "./AssignTrainer";
import Login from "../Login";
import ChangeClub from "./ChangeClub";
import ArcherList from "./../ArcherList";

const ClubHome = ({ email, role }) => {
      const [showAssignArcher, setShowAssignArcher] = useState(false);
      const [isLoggedOut, setIsLoggedOut] = useState(false);
      const [showChangeClub, setShowChangeClub] = useState(false);
      const [showAssignTrainer, setShowAssignTrainer] = useState(false);

      const handleLogout = () => {
            localStorage.removeItem("token");
            setIsLoggedOut(true);
      };

      const toggleAssignArcher = () => {
            setShowAssignArcher((prev) => !prev);
      };

      const handleChangeClub = () => {
            setShowChangeClub(true);
      };

      const toggleAssignTrainer = () => {
            setShowAssignTrainer(true);
      };

      if (isLoggedOut) {
            return <Login />;
      }

      return (
            <div>
                  <ClubData email={email} />
                  <ArcherList email={email} role={role} />
                  <button onClick={handleChangeClub}>Zmień Dane</button>
                  {showChangeClub && <ChangeClub email={email} />}
                  <button onClick={handleLogout}>Wyloguj</button>
                  <button onClick={toggleAssignArcher}>
                        {showAssignArcher ? "Hide" : "Show"} Assign Archer
                  </button>
                  {showAssignArcher && <AssignArcher clubEmail={email} />}
                  <button onClick={toggleAssignTrainer}>
                        {showAssignTrainer ? "Hide" : "Show"} Assign Trainer
                  </button>
                  {showAssignTrainer && <AssignTrainer clubEmail={email} />}
            </div>
      );
};

export default ClubHome;
