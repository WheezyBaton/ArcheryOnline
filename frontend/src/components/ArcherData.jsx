import { useState, useEffect } from "react";

const decodeToken = (token) => {
      const payload = token.split(".")[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
};

const ArcherData = () => {
      const [archerData, setArcherData] = useState(null);
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

            const fetchArcherData = async () => {
                  try {
                        const response = await fetch(
                              `http://127.0.0.1:5000/archer/personal_data/${email}`,
                              {
                                    method: "GET",
                                    headers: {
                                          "Content-Type": "application/json",
                                          Authorization: `Bearer ${token}`,
                                    },
                              }
                        );

                        if (response.ok) {
                              const data = await response.json();
                              setArcherData(data);
                        } else {
                              throw new Error("Failed to fetch archer data");
                        }
                  } catch (err) {
                        setError(err.message);
                  } finally {
                        setLoading(false);
                  }
            };

            fetchArcherData();
      }, []);

      if (loading) {
            return <div>Loading...</div>;
      }

      if (error) {
            return <div>Error: {error}</div>;
      }

      if (archerData) {
            return (
                  <div>
                        <h1>Archer Personal Data</h1>
                        <ul>
                              <li>
                                    <strong>Name:</strong> {archerData.name}{" "}
                                    {archerData.last_name}
                              </li>
                              <li>
                                    <strong>Email:</strong> {archerData.email}
                              </li>
                              <li>
                                    <strong>Gender:</strong> {archerData.gender}
                              </li>
                              <li>
                                    <strong>Birth Year:</strong>{" "}
                                    {archerData.birth_year}
                              </li>
                              <li>
                                    <strong>License Number:</strong>{" "}
                                    {archerData.license_number ||
                                          "Not available"}
                              </li>
                        </ul>
                  </div>
            );
      }

      return null;
};

export default ArcherData;
