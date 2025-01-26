import { useState } from "react";
import { decodeToken } from "./../../utils/decodeToken";

const AddTraining = () => {
      const [quantityOfShots, setQuantityOfShots] = useState("");
      const [distance, setDistance] = useState("");
      const [trainingDate, setTrainingDate] = useState("");
      const [message, setMessage] = useState("");
      const [isSubmitting, setIsSubmitting] = useState(false);

      const handleSubmit = async (e) => {
            e.preventDefault();
            setIsSubmitting(true);

            const token = localStorage.getItem("token");
            if (token) {
                  const decoded = decodeToken(token);
                  const email = decoded.email;

                  const formattedDate = new Date(trainingDate)
                        .toISOString()
                        .slice(0, 19);

                  const trainingData = {
                        date: formattedDate,
                        quantity_of_shots: parseInt(quantityOfShots, 10),
                        distance: parseInt(distance, 10),
                  };

                  try {
                        const response = await fetch(
                              `http://127.0.0.1:5000/archer/trainings/add/${email}`,
                              {
                                    method: "POST",
                                    headers: {
                                          "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(trainingData),
                              }
                        );

                        const result = await response.json();
                        if (response.ok) {
                              setMessage(result.message);
                        } else {
                              setMessage(result.message);
                        }
                  } catch (error) {
                        setMessage("Error adding training", error);
                  } finally {
                        setIsSubmitting(false);
                  }
            } else {
                  setMessage("No token found. Please log in.");
            }
      };

      return (
            <div>
                  <h2>Add Training</h2>
                  <form onSubmit={handleSubmit}>
                        <div>
                              <label>Quantity of Shots:</label>
                              <input
                                    type="number"
                                    value={quantityOfShots}
                                    onChange={(e) =>
                                          setQuantityOfShots(e.target.value)
                                    }
                                    required
                              />
                        </div>
                        <div>
                              <label>Distance:</label>
                              <input
                                    type="number"
                                    value={distance}
                                    onChange={(e) =>
                                          setDistance(e.target.value)
                                    }
                                    required
                              />
                        </div>
                        <div>
                              <label>Training Date:</label>
                              <input
                                    type="datetime-local"
                                    value={trainingDate}
                                    onChange={(e) =>
                                          setTrainingDate(e.target.value)
                                    }
                                    required
                              />
                        </div>
                        <button type="submit" disabled={isSubmitting}>
                              {isSubmitting ? "Submitting..." : "Add Training"}
                        </button>
                  </form>
                  {message && <p>{message}</p>}
            </div>
      );
};

export default AddTraining;
