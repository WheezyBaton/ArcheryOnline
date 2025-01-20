import { useState, useEffect } from "react";
import { decodeToken } from "../utils/decodeToken";

const GetIndoorTournament = () => {
      const [tournaments, setTournaments] = useState([]);
      const [showDetails, setShowDetails] = useState(null);

      useEffect(() => {
            const token = localStorage.getItem("token");
            if (token) {
                  const decoded = decodeToken(token);
                  const email = decoded.email;

                  fetch(`http://127.0.0.1:5000/archer/tournaments/${email}`)
                        .then((response) => response.json())
                        .then((data) => {
                              const indoorTournaments = data.tournaments.filter(
                                    (tournament) => tournament.type === "indoor"
                              );
                              setTournaments(indoorTournaments);
                        })
                        .catch((error) =>
                              console.error(
                                    "Error fetching tournaments:",
                                    error
                              )
                        );
            } else {
                  console.log("No token found.");
            }
      }, []);

      const handleToggleDetails = (index) => {
            setShowDetails(showDetails === index ? null : index);
      };

      return (
            <div>
                  {tournaments.map((tournament, index) => (
                        <div
                              key={index}
                              onClick={() => handleToggleDetails(index)}
                        >
                              <p>{`Indoor Tournament ${index + 1}: ${
                                    tournament.date
                              }, ${tournament.distance}m, Total Score: ${
                                    tournament.total_score
                              }`}</p>
                              {showDetails === index && (
                                    <table>
                                          <thead>
                                                <tr>
                                                      <th>Series #</th>
                                                      <th>shoot 1</th>
                                                      <th>shoot 2</th>
                                                      <th>shoot 3</th>
                                                      <th>Result</th>
                                                      <th>10s</th>
                                                      <th>9s</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                {tournament.series.map(
                                                      (series, seriesIndex) => {
                                                            const result =
                                                                  series.reduce(
                                                                        (
                                                                              acc,
                                                                              shot
                                                                        ) =>
                                                                              acc +
                                                                              shot,
                                                                        0
                                                                  );
                                                            const count10 =
                                                                  series.filter(
                                                                        (
                                                                              shot
                                                                        ) =>
                                                                              shot ===
                                                                              10
                                                                  ).length;
                                                            const count9 =
                                                                  series.filter(
                                                                        (
                                                                              shot
                                                                        ) =>
                                                                              shot ===
                                                                              9
                                                                  ).length;
                                                            return (
                                                                  <tr
                                                                        key={
                                                                              seriesIndex
                                                                        }
                                                                  >
                                                                        <td>
                                                                              {seriesIndex +
                                                                                    1}
                                                                        </td>
                                                                        {series.map(
                                                                              (
                                                                                    shot,
                                                                                    shotIndex
                                                                              ) => (
                                                                                    <td
                                                                                          key={
                                                                                                shotIndex
                                                                                          }
                                                                                    >
                                                                                          {
                                                                                                shot
                                                                                          }
                                                                                    </td>
                                                                              )
                                                                        )}
                                                                        <td>
                                                                              {
                                                                                    result
                                                                              }
                                                                        </td>
                                                                        <td>
                                                                              {
                                                                                    count10
                                                                              }
                                                                        </td>
                                                                        <td>
                                                                              {
                                                                                    count9
                                                                              }
                                                                        </td>
                                                                  </tr>
                                                            );
                                                      }
                                                )}
                                          </tbody>
                                    </table>
                              )}
                        </div>
                  ))}
            </div>
      );
};

export default GetIndoorTournament;
