import { useState, useEffect } from "react";
import DischargeTrainer from "./clubComponents/DischargeTrainer";
import TrainerData from "./userDataComponents/TrainerData";

const TrainerList = ({ email }) => {
      const [trainers, setTrainers] = useState([]);
      const [message, setMessage] = useState("");
      const [loading, setLoading] = useState(false);
      const [selectedTrainer, setSelectedTrainer] = useState(null);

      const fetchTrainers = async (email) => {
            setLoading(true);

            try {
                  const response = await fetch(
                        `http://127.0.0.1:5000/club/trainers/${email}`,
                        {
                              method: "GET",
                              headers: {
                                    "Content-Type": "application/json",
                              },
                        }
                  );

                  const data = await response.json();

                  if (response.ok) {
                        setTrainers(data.trainers);
                  } else {
                        setMessage(data.message || "Failed to fetch trainers.");
                  }
            } catch (error) {
                  setMessage(
                        "An error occurred while fetching trainers.",
                        error
                  );
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            fetchTrainers(email);
      }, [email]);

      const handleShowTrainerData = (trainer) => {
            setSelectedTrainer(trainer);
      };

      const handleCloseTrainerData = () => {
            setSelectedTrainer(null);
      };

      return (
            <div>
                  {loading && <p>Loading...</p>}
                  {message && <p>{message}</p>}

                  {!loading && trainers.length > 0 && (
                        <>
                              {trainers.map((trainer, index) => (
                                    <li key={index}>
                                          <button
                                                className="nav-button"
                                                onClick={() =>
                                                      handleShowTrainerData(
                                                            trainer
                                                      )
                                                }
                                          >
                                                {trainer.name}{" "}
                                                {trainer.last_name}
                                          </button>
                                    </li>
                              ))}
                        </>
                  )}

                  {!loading && trainers.length === 0 && !message && (
                        <p>No trainers found</p>
                  )}

                  {selectedTrainer && (
                        <div>
                              <TrainerData email={selectedTrainer.email} />

                              <DischargeTrainer email={selectedTrainer.email} />

                              <button
                                    className="nav-button"
                                    onClick={handleCloseTrainerData}
                              >
                                    Close
                              </button>
                        </div>
                  )}
            </div>
      );
};

export default TrainerList;
