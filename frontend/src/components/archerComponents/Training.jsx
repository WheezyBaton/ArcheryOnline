import { useState } from "react";
import AddTraining from "./AddTraining";
import GetTraining from "./GetTraining";

const Training = ({ email }) => {
      const [showTournament, setShowTournament] = useState(false);

      const toggleTrainingVisibility = () => {
            setShowTournament((prevState) => !prevState);
      };

      return (
            <div>
                  <AddTraining email={email} />
                  <button
                        className="nav-button"
                        onClick={toggleTrainingVisibility}
                  >
                        {showTournament ? "Hide trainings" : "Show trainings"}
                  </button>
                  {showTournament && <GetTraining email={email} />}
            </div>
      );
};

export default Training;
