import { useState } from "react";
import AddChildrenOutdoorTournament from "./AddChildrenOutdoorTournament";
import AddAdultOutdoorTournament from "./AddAdultOutdoorTournament";
import AddIndoorTournament from "./AddIndoorTournament";

const AddTournament = ({ email }, { birth_year }) => {
      const [showOptions, setShowOptions] = useState(false);
      const [showOutdoorOptions, setShowOutdoorOptions] = useState(false);
      const [selectedTournament, setSelectedTournament] = useState(null);

      const calculateAge = (birth_year) => {
            const currentYear = new Date().getFullYear();
            return currentYear - birth_year;
      };

      const handleAddTournamentClick = () => {
            setShowOptions(true);
      };

      const handleOutdoorTestClick = () => {
            setShowOutdoorOptions(true);
      };

      const handleOutdoorTestSelection = () => {
            if (birth_year && calculateAge(birth_year) < 15) {
                  setSelectedTournament(
                        <AddChildrenOutdoorTournament email={email} />
                  );
            } else {
                  setSelectedTournament(
                        <AddAdultOutdoorTournament email={email} />
                  );
            }
            setShowOutdoorOptions(false);
      };

      const handleIndoorTestClick = () => {
            setSelectedTournament(<AddIndoorTournament email={email} />);
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
                                    {birth_year && calculateAge(birth_year) < 15
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
