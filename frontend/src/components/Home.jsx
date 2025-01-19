import { useState } from "react";
import ArcherData from "./ArcherData";
import Login from "./Login";

const Home = () => {
      const [isLoggedOut, setIsLoggedOut] = useState(false);

      const handleLogout = () => {
            localStorage.removeItem("token");
            setIsLoggedOut(true);
      };

      if (isLoggedOut) {
            return <Login />;
      }

      return (
            <div>
                  <ArcherData />
                  <button onClick={handleLogout}>Wyloguj</button>{" "}
            </div>
      );
};

export default Home;
