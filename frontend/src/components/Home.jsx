import { useState } from "react";
import ArcherData from "./ArcherData";
import Login from "./Login";
import DeleteArcher from "./DeleteArcher";
import AddTournament from "./AddTournament";

const Home = () => {
      const [isLoggedOut, setIsLoggedOut] = useState(false);
      const [showDelete, setShowDelete] = useState(false);

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
            </div>
      );
};

export default Home;
