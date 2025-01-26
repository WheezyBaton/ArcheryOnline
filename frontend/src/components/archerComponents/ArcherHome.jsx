import { useState } from "react";
import ArcherData from "./ArcherData";
import Login from "../Login";
import DeleteArcher from "./DeleteArcher";
import AddTournament from "./AddTournament";
import ChangeArcher from "./ChangeArcher";
import GetTournament from "./GetTournament";
import AddTraining from "./AddTraining";
import GetTraining from "./GetTraining";

const Home = ({ email }) => {
      const [isLoggedOut, setIsLoggedOut] = useState(false);
      const [showDelete, setShowDelete] = useState(false);
      const [showChangeArcher, setShowChangeArcher] = useState(false);
      const [showTournament, setShowTournament] = useState(false);
      const [showAddTraining, setShowAddTraining] = useState(false);
      const [showGetTraining, setShowGetTraining] = useState(false);

      const handleLogout = () => {
            localStorage.removeItem("token");
            setIsLoggedOut(true);
      };

      const handleDeleteAccount = () => {
            const confirmation = window.confirm(
                  "Are you sure you want to delete your account? This action cannot be undone."
            );

            if (confirmation) {
                  setShowDelete(true);
            }
      };

      const handleChangeArcher = () => {
            setShowChangeArcher(true);
      };

      const toggleTournamentVisibility = () => {
            setShowTournament((prevState) => !prevState);
      };

      const toggleAddTrainingVisibility = () => {
            setShowAddTraining((prevState) => !prevState);
      };

      const toggleGetTrainingVisibility = () => {
            setShowGetTraining((prevState) => !prevState);
      };

      if (isLoggedOut) {
            return <Login />;
      }

      return (
            <div>
                  <ArcherData email={email} />
                  <button onClick={handleLogout}>Wyloguj</button>
                  <button onClick={handleDeleteAccount}>Usuń Konto</button>
                  {showDelete && <DeleteArcher email={email} />}
                  <AddTournament email={email} />
                  <button onClick={handleChangeArcher}>Zmień Dane</button>
                  {showChangeArcher && <ChangeArcher email={email} />}
                  <button onClick={toggleTournamentVisibility}>
                        {showTournament ? "Ukryj Turnieje" : "Pokaż Turnieje"}
                  </button>
                  {showTournament && <GetTournament email={email} />}
                  <button onClick={toggleAddTrainingVisibility}>
                        {showAddTraining
                              ? "Ukryj Dodaj Trening"
                              : "Dodaj Trening"}
                  </button>
                  {showAddTraining && <AddTraining email={email} />}
                  <button onClick={toggleGetTrainingVisibility}>
                        {showGetTraining ? "Ukryj Treningi" : "Pokaż Treningi"}
                  </button>
                  {showGetTraining && <GetTraining email={email} />}{" "}
            </div>
      );
};

export default Home;
