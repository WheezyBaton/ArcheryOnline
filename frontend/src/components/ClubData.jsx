import { useState, useEffect } from "react";
import { decodeToken } from "../utils/decodeToken";

const ClubData = () => {
      const [clubData, setClubData] = useState(null);
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

            const fetchClubData = async () => {
                  try {
                        const response = await fetch(
                              `http://127.0.0.1:5000/club/${email}`,
                              {
                                    method: "GET",
                                    headers: {
                                          "Content-Type": "application/json",
                                    },
                              }
                        );

                        if (response.ok) {
                              const data = await response.json();
                              setClubData(data);
                        } else {
                              throw new Error("Failed to fetch club data");
                        }
                  } catch (err) {
                        setError(err.message);
                  } finally {
                        setLoading(false);
                  }
            };

            fetchClubData();
      }, []);

      if (loading) {
            return <div>Loading...</div>;
      }

      if (error) {
            return <div>Error: {error}</div>;
      }

      if (clubData) {
            return (
                  <div>
                        <h1>Club Data</h1>
                        <ul>
                              <li>
                                    <strong>Name:</strong> {clubData.name}
                              </li>
                              <li>
                                    <strong>Address:</strong> {clubData.address}
                              </li>
                              <li>
                                    <strong>Phone Number:</strong>{" "}
                                    {clubData.phone_number}
                              </li>
                              <li>
                                    <strong>Email:</strong> {clubData.email}
                              </li>
                        </ul>
                  </div>
            );
      }

      return null;
};

export default ClubData;
