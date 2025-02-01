import { useState } from "react";
import {
      calculateSeriesStats,
      calculateTotalScore,
      handleSeriesChange,
} from "../../utils/tournamentUtils";

const AddIndoorTournament = ({ email }) => {
      const [series, setSeries] = useState([
            [0, 0, 0],
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

            setLoading(true);
            const tournamentData = {
                  series,
            };

            try {
                  const response = await fetch(
                        `http://127.0.0.1:5000/archer/tournaments/indoor/${email}`,
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
                  <h2>Add Indoor Tournament</h2>
                  <form onSubmit={handleAddTournament}>
                        <label>Distance: 18m</label>
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
                        <button
                              className="nav-button"
                              type="submit"
                              disabled={loading}
                        >
                              {loading ? "Adding..." : "Add Tournament"}
                        </button>
                  </form>
                  {message && <p>{message}</p>}
            </div>
      );
};

export default AddIndoorTournament;
