import AddTournament from "./AddTournament";
import GetTournament from "./GetTournament";

const Tournament = ({ email }) => {
      return (
            <div>
                  <AddTournament email={email} />
                  <GetTournament email={email} />
            </div>
      );
};

export default Tournament;
