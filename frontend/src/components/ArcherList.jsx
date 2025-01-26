import { useState, useEffect } from "react";

const ArcherList = ({ email, role }) => {
      const [archers, setArchers] = useState([]);
      const [message, setMessage] = useState("");
      const [loading, setLoading] = useState(false);

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

      useEffect(() => {
            fetchArchers(email, role);
      }, [email, role]);

      return (
            <div>
                  <h2>Archer List</h2>

                  {loading && <p>Loading...</p>}
                  {message && <p>{message}</p>}

                  {!loading && archers.length > 0 && (
                        <ul>
                              {archers.map((archer, index) => (
                                    <li key={index}>
                                          <strong>Name:</strong> {archer.name}{" "}
                                          {archer.last_name} <br />
                                          <strong>Email:</strong> {archer.email}{" "}
                                          <br />
                                          <strong>License Number:</strong>{" "}
                                          {archer.license_number}
                                    </li>
                              ))}
                        </ul>
                  )}

                  {!loading && archers.length === 0 && !message && (
                        <p>No archers found for this club.</p>
                  )}
            </div>
      );
};

export default ArcherList;
