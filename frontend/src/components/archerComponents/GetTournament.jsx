import GetIndoorTournament from "./GetIndoorTournament";
import GetAdultOutdoorTournament from "./GetAdultOutdoorTournament";
import GetChildrenOutdoorTournament from "./GetChildrenOutdoorTournament";

const GetTournament = ({ email }) => {
      return (
            <div>
                  <GetIndoorTournament email={email} />
                  <GetAdultOutdoorTournament email={email} />
                  <GetChildrenOutdoorTournament email={email} />
            </div>
      );
};

export default GetTournament;
