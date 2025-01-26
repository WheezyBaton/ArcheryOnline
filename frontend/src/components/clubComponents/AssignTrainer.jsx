import { useState } from "react";

export default function AssignTrainer({ clubEmail }) {
      const [trainerEmail, setTrainerEmail] = useState("");
      const [message, setMessage] = useState(null);
      const [error, setError] = useState(null);

      const handleAssign = async () => {
            try {
                  const response = await fetch(
                        `http://127.0.0.1:5000/trainer/assign/${trainerEmail}/${clubEmail}`,
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
                  setError("Failed to assign trainer. Please try again later.");
            }
      };

      return (
            <div>
                  <h2>Assign Trainer to Club</h2>

                  <input
                        type="email"
                        placeholder="Trainer's Email"
                        value={trainerEmail}
                        onChange={(e) => setTrainerEmail(e.target.value)}
                  />

                  <button onClick={handleAssign}>Assign Trainer</button>

                  {message && <p style={{ color: "green" }}>{message}</p>}
                  {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
      );
}
