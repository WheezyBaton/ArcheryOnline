import GetIndoorTournament from "./GetIndoorTournament";
import GetAdultOutdoorTournament from "./GetAdultOutdoorTournament";
import GetChildrenOutdoorTournament from "./GetChildrenOutdoorTournament";

const GetTournament = () => {
      return (
            <div>
                  <GetIndoorTournament />
                  <GetAdultOutdoorTournament />
                  <GetChildrenOutdoorTournament />
            </div>
      );
};

export default GetTournament;
