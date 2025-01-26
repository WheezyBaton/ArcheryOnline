import { useState, useEffect } from "react";
import { decodeToken } from "../utils/decodeToken";

const TrainerData = () => {
      const [trainerData, setTrainerData] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
            const token = localStorage.getItem("token");

            if (!token) {
                  setError("Token not found. Please log in.");
                  setLoading(false);
                  return;
            }

            const decodedToken = decodeToken(token);
            const email = decodedToken.email;

            if (!email) {
                  setError("Email not found in token.");
                  setLoading(false);
                  return;
            }

            const fetchTrainerData = async () => {
                  try {
                        const response = await fetch(
                              `http://127.0.0.1:5000/trainer/personal_data/${email}`,
                              {
                                    method: "GET",
                                    headers: {
                                          "Content-Type": "application/json",
                                    },
                              }
                        );

                        if (response.ok) {
                              const data = await response.json();
                              setTrainerData(data);
                        } else {
                              throw new Error("Failed to fetch trainer data");
                        }
                  } catch (err) {
                        setError(err.message);
                  } finally {
                        setLoading(false);
                  }
            };

            fetchTrainerData();
      }, []);

      if (loading) {
            return <div>Loading...</div>;
      }

      if (error) {
            return <div>Error: {error}</div>;
      }

      if (trainerData) {
            return (
                  <div>
                        <h1> Personal Data</h1>
                        <ul>
                              <li>
                                    <strong>Name:</strong> {trainerData.name}{" "}
                                    {trainerData.last_name}
                              </li>
                              <li>
                                    <strong>Email:</strong> {trainerData.email}
                              </li>
                              <li>
                                    <strong>Birth Year:</strong>{" "}
                                    {trainerData.birth_year}
                              </li>
                              <li>
                                    <strong>License Number:</strong>{" "}
                                    {trainerData.license_number ||
                                          "Not available"}
                              </li>
                              <li>
                                    <strong>Club:</strong>{" "}
                                    {trainerData.club || "Not available"}
                              </li>
                        </ul>
                  </div>
            );
      }

      return null;
};

export default TrainerData;
