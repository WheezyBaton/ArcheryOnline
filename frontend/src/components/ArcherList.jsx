import { useState, useEffect } from "react";
import ArcherData from "./userDataComponents/ArcherData";
import GetTournament from "./archerComponents/GetTournament";
import GetTraining from "./archerComponents/GetTraining";
import DischargeArcher from "./clubComponents/DischargeArcher";
import AssignArcherToTrainer from "./clubComponents/AssignArcherToTrainer";

const ArcherList = ({ email, role }) => {
      const [archers, setArchers] = useState([]);
      const [message, setMessage] = useState("");
      const [loading, setLoading] = useState(false);
      const [selectedArcher, setSelectedArcher] = useState(null);
      const [trainer, setTrainer] = useState(null);

      const fetchArchers = async (email, role) => {
            setLoading(true);

            try {
                  const response = await fetch(
                        `http://127.0.0.1:5000/${role}/archers/${email}`,
                        {
                              method: "GET",
                              headers: {
                                    "Content-Type": "application/json",
                              },
                        }
                  );

                  const data = await response.json();

                  if (response.ok) {
                        setArchers(data.archers);
                  } else {
                        setMessage(data.message || "Failed to fetch archers.");
                  }
            } catch (error) {
                  setMessage(
                        "An error occurred while fetching archers.",
                        error
                  );
            } finally {
                  setLoading(false);
            }
      };

      const fetchTrainer = async (archerEmail) => {
            try {
                  const response = await fetch(
                        `http://127.0.0.1:5000/archer/${archerEmail}/trainer`,
                        {
                              method: "GET",
                              headers: {
                                    "Content-Type": "application/json",
                              },
                        }
                  );

                  if (response.ok) {
                        const data = await response.json();
                        setTrainer(data);
                  } else {
                        setTrainer(null);
                  }
            } catch (error) {
                  setTrainer(null);
            }
      };

      useEffect(() => {
            fetchArchers(email, role);
      }, [email, role]);

      const handleShowArcherData = (archer) => {
            setSelectedArcher(archer);
            fetchTrainer(archer.email);
      };

      const handleCloseArcherData = () => {
            setSelectedArcher(null);
            setTrainer(null);
      };

      const handleDischargeArcher = async () => {
            const confirmation = window.confirm(
                  "Are you sure you want to discharge the trainer from this archer?"
            );

            if (confirmation) {
                  try {
                        const response = await fetch(
                              `http://127.0.0.1:5000/discharge/${selectedArcher.email}`,
                              {
                                    method: "POST",
                                    headers: {
                                          "Content-Type": "application/json",
                                    },
                              }
                        );

                        if (response.ok) {
                              const data = await response.json();
                              alert(data.message);
                              setTrainer(null);
                        } else {
                              alert(
                                    "Failed to discharge archer. Please try again."
                              );
                        }
                  } catch (error) {
                        alert("An error occurred. Please try again.");
                  }
            }
      };

      return (
            <div>
                  {loading && <p>Loading...</p>}
                  {message && <p>{message}</p>}

                  {!loading && archers.length > 0 && (
                        <>
                              {archers.map((archer, index) => (
                                    <li key={index}>
                                          <button
                                                className="nav-button"
                                                onClick={() =>
                                                      handleShowArcherData(
                                                            archer
                                                      )
                                                }
                                                disabled={
                                                      selectedArcher !== null
                                                }
                                          >
                                                {archer.name} {archer.last_name}
                                          </button>
                                    </li>
                              ))}
                        </>
                  )}

                  {!loading && archers.length === 0 && !message && (
                        <p>No archers found</p>
                  )}

                  {selectedArcher && (
                        <div>
                              <ArcherData email={selectedArcher.email} />
                              {role === "Club Manager" && trainer ? (
                                    <div>
                                          <p>
                                                Trainer: {trainer.name}{" "}
                                                {trainer.last_name}
                                          </p>
                                          <button
                                                className="logout-button"
                                                onClick={handleDischargeArcher}
                                          >
                                                Discharge Archer from Trainer
                                          </button>
                                    </div>
                              ) : (
                                    role === "Club Manager" && (
                                          <AssignArcherToTrainer
                                                clubEmail={email}
                                                archerEmail={
                                                      selectedArcher.email
                                                }
                                          />
                                    )
                              )}
                              <GetTournament email={selectedArcher.email} />
                              <GetTraining email={selectedArcher.email} />
                              {role === "Club Manager" && (
                                    <DischargeArcher
                                          email={selectedArcher.email}
                                    />
                              )}
                              <button
                                    className="nav-button"
                                    onClick={handleCloseArcherData}
                              >
                                    Close
                              </button>
                        </div>
                  )}
            </div>
      );
};

export default ArcherList;
