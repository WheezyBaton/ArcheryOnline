import { useState } from "react";
import ClubData from "./ClubData";
import AssignArcher from "./AssignArcher";
import Login from "./Login";
import ChangeClub from "./ChangeClub";
import ArcherList from "./ArcherList";

const ClubHome = () => {
      const [showAssignArcher, setShowAssignArcher] = useState(false);
      const [isLoggedOut, setIsLoggedOut] = useState(false);
      const [showChangeClub, setShowChangeClub] = useState(false);

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

      if (isLoggedOut) {
            return <Login />;
      }

      return (
            <div>
                  <ClubData />
                  <ArcherList />
                  <button onClick={handleChangeClub}>Zmień Dane</button>
                  {showChangeClub && <ChangeClub />}
                  <button onClick={handleLogout}>Wyloguj</button>
                  <button onClick={toggleAssignArcher}>
                        {showAssignArcher ? "Hide" : "Show"} Assign Archer
                  </button>
                  {showAssignArcher && <AssignArcher />}
            </div>
      );
};

export default ClubHome;
