import { useState, useEffect } from "react";
import { decodeToken } from "./../../utils/decodeToken";
import AddChildrenOutdoorTournament from "./AddChildrenOutdoorTournament";
import AddAdultOutdoorTournament from "./AddAdultOutdoorTournament";
import AddIndoorTournament from "./AddIndoorTournament";

const AddTournament = () => {
      const [showOptions, setShowOptions] = useState(false);
      const [showOutdoorOptions, setShowOutdoorOptions] = useState(false);
      const [userBirthYear, setUserBirthYear] = useState(null);
      const [selectedTournament, setSelectedTournament] = useState(null);

      useEffect(() => {
            const token = localStorage.getItem("token");
            if (token) {
                  const decoded = decodeToken(token);
                  const birthYear = decoded.birth_year;
                  setUserBirthYear(birthYear);
            } else {
                  setSelectedTournament(null);
            }
      }, []);

      const calculateAge = (birthYear) => {
            const currentYear = new Date().getFullYear();
            return currentYear - birthYear;
      };

      const handleAddTournamentClick = () => {
            setShowOptions(true);
      };

      const handleOutdoorTestClick = () => {
            setShowOutdoorOptions(true);
      };

      const handleOutdoorTestSelection = () => {
            if (userBirthYear && calculateAge(userBirthYear) < 15) {
                  setSelectedTournament(<AddChildrenOutdoorTournament />);
            } else {
                  setSelectedTournament(<AddAdultOutdoorTournament />);
            }
            setShowOutdoorOptions(false);
      };

      const handleIndoorTestClick = () => {
            setSelectedTournament(<AddIndoorTournament />);
            setShowOutdoorOptions(false);
      };

      return (
            <div>
                  {!showOptions && (
                        <button onClick={handleAddTournamentClick}>
                              Dodaj sprawdzian
                        </button>
                  )}

                  {showOptions && (
                        <div>
                              <button onClick={handleOutdoorTestClick}>
                                    Sprawdzian na dworze
                              </button>
                              <button onClick={handleIndoorTestClick}>
                                    Sprawdzian na hali
                              </button>
                        </div>
                  )}

                  {showOutdoorOptions && (
                        <div>
                              <button onClick={handleOutdoorTestSelection}>
                                    {userBirthYear &&
                                    calculateAge(userBirthYear) < 15
                                          ? "Sprawdzian na dworze (Dzieci)"
                                          : "Sprawdzian na dworze (Dorośli)"}
                              </button>
                        </div>
                  )}

                  {selectedTournament}
            </div>
      );
};

export default AddTournament;
