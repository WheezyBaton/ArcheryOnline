import { useState } from "react";
import ArcherData from "./ArcherData";
import Login from "./Login";
import DeleteArcher from "./DeleteArcher";
import AddTournament from "./AddTournament";
import ChangeArcher from "./ChangeArcher";
import GetTournament from "./GetTournament";

const Home = () => {
      const [isLoggedOut, setIsLoggedOut] = useState(false);
      const [showDelete, setShowDelete] = useState(false);
      const [showChangeArcher, setShowChangeArcher] = useState(false);
      const [showTournament, setShowTournament] = useState(false);

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

      if (isLoggedOut) {
            return <Login />;
      }

      return (
            <div>
                  <ArcherData />
                  <button onClick={handleLogout}>Wyloguj</button>
                  <button onClick={handleDeleteAccount}>Usuń Konto</button>
                  {showDelete && <DeleteArcher />}
                  <AddTournament />
                  <button onClick={handleChangeArcher}>Zmień Dane</button>
                  {showChangeArcher && <ChangeArcher />}{" "}
                  <button onClick={toggleTournamentVisibility}>
                        {showTournament ? "Ukryj Turnieje" : "Pokaż Turnieje"}
                  </button>
                  {showTournament && <GetTournament />}{" "}
            </div>
      );
};

export default Home;
