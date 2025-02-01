import { useState } from "react";
import AddChildrenOutdoorTournament from "./AddChildrenOutdoorTournament";
import AddAdultOutdoorTournament from "./AddAdultOutdoorTournament";
import AddIndoorTournament from "./AddIndoorTournament";

const AddTournament = ({ email }, { birth_year }) => {
      const [showOptions, setShowOptions] = useState(false);
      const [selectedTournament, setSelectedTournament] = useState(null);

      const calculateAge = (birth_year) => {
            const currentYear = new Date().getFullYear();
            return currentYear - birth_year;
      };

      const handleAddTournamentClick = () => {
            setShowOptions(true);
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
      };

      const handleIndoorTestClick = () => {
            setSelectedTournament(<AddIndoorTournament email={email} />);
      };

      return (
            <div>
                  {!showOptions && (
                        <button
                              className="nav-button"
                              onClick={handleAddTournamentClick}
                        >
                              Add
                        </button>
                  )}

                  {showOptions && (
                        <div>
                              <button
                                    className="nav-button"
                                    onClick={handleOutdoorTestSelection}
                              >
                                    {birth_year && calculateAge(birth_year) < 15
                                          ? "Outdoor Tournament"
                                          : "Outdoor Tournament"}
                              </button>
                              <button
                                    className="nav-button"
                                    onClick={handleIndoorTestClick}
                              >
                                    Indoor Tournament
                              </button>
                        </div>
                  )}

                  {selectedTournament}
            </div>
      );
};

export default AddTournament;
