import { useState, useEffect } from "react";
import { decodeToken } from "./../utils/decodeToken";
import {
      calculateSeriesStats,
      handleSeriesChange,
      calculateTotalScore,
} from "./../utils/tournamentUtils";

const AddChildrenOutdoorTournament = () => {
      const [email, setEmail] = useState("");
      const [distance, setDistance] = useState(18);
      const [series, setSeries] = useState([
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 9],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
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

      const onSeriesChange = (e, seriesIndex, shotIndex) => {
            const updatedSeries = handleSeriesChange(
                  series,
                  seriesIndex,
                  shotIndex,
                  e.target.value
            );
            setSeries(updatedSeries);
      };

      const handleAddTournament = async (e) => {
            e.preventDefault();

            if (!email) {
                  setMessage("Email is required");
                  return;
            }

            if (series.length !== 12 || series.some((s) => s.length !== 3)) {
                  setMessage(
                        "For children tournaments, there must be 12 series with 3 shots each"
                  );
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
                  <h2>Add Children Outdoor Tournament</h2>
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
                                                                        onSeriesChange(
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
                        <div>
                              <h3>
                                    Total Score: {calculateTotalScore(series)}
                              </h3>
                        </div>
                        <button type="submit" disabled={loading}>
                              {loading ? "Adding..." : "Add Tournament"}
                        </button>
                  </form>
                  {message && <p>{message}</p>}
            </div>
      );
};

export default AddChildrenOutdoorTournament;
