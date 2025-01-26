import { useState } from "react";
import TrainerData from "./TrainerData";
import ChangeTrainer from "./ChangeTrainer";
import Login from "../Login";
import ArcherList from "./../ArcherList";

const TrainerHome = ({ email, role }) => {
      const [isLoggedOut, setIsLoggedOut] = useState(false);
      const [showChangeTrainer, setShowChangeTrainer] = useState(false);

      const handleLogout = () => {
            localStorage.removeItem("token");
            setIsLoggedOut(true);
      };

      const handleChangeTrainer = () => {
            setShowChangeTrainer(true);
      };

      if (isLoggedOut) {
            return <Login />;
      }

      return (
            <div>
                  <TrainerData email={email} />
                  <ArcherList email={email} role={role} />
                  <button onClick={handleLogout}>Wyloguj</button>
                  <button onClick={handleChangeTrainer}>Zmień Dane</button>
                  {showChangeTrainer && <ChangeTrainer email={email} />}
            </div>
      );
};

export default TrainerHome;
