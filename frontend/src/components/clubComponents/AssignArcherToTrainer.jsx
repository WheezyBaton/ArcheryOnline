import { useState } from "react";

export default function AssignArcherToTrainer({ clubEmail, archerEmail }) {
      const [trainerEmail, setTrainerEmail] = useState("");
      const [message, setMessage] = useState(null);
      const [error, setError] = useState(null);

      const handleAssign = async () => {
            try {
                  const response = await fetch(
                        `http://127.0.0.1:5000/assign/${clubEmail}/${archerEmail}/${trainerEmail}`,
                        {
                              method: "POST",
                              headers: {
                                    "Content-Type": "application/json",
                              },
                        }
                  );

                  if (response.ok) {
                        const data = await response.json();
                        setMessage(data.message);
                        setError(null);
                  } else {
                        const data = await response.json();
                        setError(data.message || "Something went wrong.");
                        setMessage(null);
                  }
            } catch (err) {
                  console.error("Error during fetch:", err);
                  setError("Failed to assign archer. Please try again later.");
            }
      };

      return (
            <div>
                  <h2>Assign archer to trainer</h2>

                  <input
                        type="email"
                        placeholder="Trainer Email"
                        value={trainerEmail}
                        onChange={(e) => setTrainerEmail(e.target.value)}
                  />

                  <button className="nav-button" onClick={handleAssign}>
                        Assign archer
                  </button>

                  {message && <p style={{ color: "green" }}>{message}</p>}
                  {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
      );
}
