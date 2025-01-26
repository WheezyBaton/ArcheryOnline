import { useState } from "react";
import TrainerData from "./TrainerData";
import ChangeTrainer from "./ChangeTrainer";
import Login from "./Login";

const TrainerHome = () => {
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
                  <TrainerData />
                  <button onClick={handleLogout}>Wyloguj</button>
                  <button onClick={handleChangeTrainer}>Zmień Dane</button>
                  {showChangeTrainer && <ChangeTrainer />}
            </div>
      );
};

export default TrainerHome;
