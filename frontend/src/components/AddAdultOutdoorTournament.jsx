import { useState, useEffect } from "react";
import { decodeToken } from "./../utils/decodeToken";

const AddAdultOutdoorTournament = () => {
      const [email, setEmail] = useState("");
      const [distance, setDistance] = useState(18);
      const [series, setSeries] = useState([
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
      ]);
      const [message, setMessage] = useState("");
      const [loading, setLoading] = useState(false);

      useEffect(() => {
            const token = localStorage.getItem("token");
            if (token) {
                  const decoded = decodeToken(token);
                  const email = decoded.email;
                  setEmail(email);
            } else {
                  setMessage("No token found. Please log in.");
            }
      }, []);

      const calculateSeriesStats = (serie) => {
            const sum = serie.reduce((acc, score) => acc + score, 0);
            const count10 = serie.filter((score) => score === 10).length;
            const count9 = serie.filter((score) => score === 9).length;
            return { sum, count10, count9 };
      };

      const handleSeriesChange = (e, seriesIndex, shotIndex) => {
            const newSeries = [...series];
            newSeries[seriesIndex][shotIndex] = parseInt(e.target.value, 10);
            setSeries(newSeries);
      };

      const handleAddTournament = async (e) => {
            e.preventDefault();

            if (!email) {
                  setMessage("Email is required");
                  return;
            }

            setLoading(true);
            const tournamentData = {
                  distance,
                  series,
            };

            try {
                  const response = await fetch(
                        `http://127.0.0.1:5000/archer/tournaments/outdoor/${email}`,
                        {
                              method: "POST",
                              headers: {
                                    "Content-Type": "application/json",
                              },
                              body: JSON.stringify(tournamentData),
                        }
                  );

                  const data = await response.json();

                  if (response.ok) {
                        setMessage(data.message);
                  } else {
                        setMessage(data.message || "An error occurred");
                  }
            } catch (error) {
                  setMessage(
                        "An error occurred while adding the tournament: ",
                        error
                  );
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div>
                  <h2>Add Outdoor Tournament</h2>
                  <form onSubmit={handleAddTournament}>
                        <label>Distance:</label>
                        <input
                              type="number"
                              value={distance}
                              onChange={(e) =>
                                    setDistance(parseInt(e.target.value, 10))
                              }
                              required
                              min="1"
                        />
                        <div>
                              <h3>Series:</h3>
                              {series.map((serie, seriesIndex) => {
                                    const { sum, count10, count9 } =
                                          calculateSeriesStats(serie);
                                    return (
                                          <div
                                                key={seriesIndex}
                                                className="series-row"
                                          >
                                                <label>
                                                      Series {seriesIndex + 1}:
                                                </label>
                                                {serie.map(
                                                      (shot, shotIndex) => (
                                                            <input
                                                                  key={
                                                                        shotIndex
                                                                  }
                                                                  type="number"
                                                                  min="0"
                                                                  max="10"
                                                                  value={shot}
                                                                  onChange={(
                                                                        e
                                                                  ) =>
                                                                        handleSeriesChange(
                                                                              e,
                                                                              seriesIndex,
                                                                              shotIndex
                                                                        )
                                                                  }
                                                                  required
                                                            />
                                                      )
                                                )}
                                                <div>
                                                      <span>Sum: {sum}</span>
                                                      <span>
                                                            {" "}
                                                            10s: {count10}
                                                      </span>
                                                      <span> 9s: {count9}</span>
                                                </div>
                                          </div>
                                    );
                              })}
                        </div>
                        <button type="submit" disabled={loading}>
                              {loading ? "Adding..." : "Add Tournament"}
                        </button>
                  </form>
                  {message && <p>{message}</p>}{" "}
            </div>
      );
};

export default AddAdultOutdoorTournament;
