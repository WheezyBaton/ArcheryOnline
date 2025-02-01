import { useState, useEffect } from "react";

const ClubData = ({ email }) => {
      const [clubData, setClubData] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
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
      }, [email]);

      if (loading) {
            return <div>Loading...</div>;
      }

      if (error) {
            return <div>Error: {error}</div>;
      }

      if (clubData) {
            return (
                  <div>
                        <strong>{clubData.name}</strong>

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
                  </div>
            );
      }

      return null;
};

export default ClubData;
