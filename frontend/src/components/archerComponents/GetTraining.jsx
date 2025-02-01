import { useState, useEffect } from "react";
import "./getTraining.css";

const GetTraining = ({ email }) => {
      const [trainings, setTrainings] = useState([]);
      const [error, setError] = useState(null);

      useEffect(() => {
            fetch(`http://127.0.0.1:5000/archer/trainings/${email}`)
                  .then((response) => {
                        if (response.ok) {
                              return response.json();
                        }
                        throw new Error("Nie znaleziono treningów.");
                  })
                  .then((data) => {
                        setTrainings(data.trainings);
                  })
                  .catch((error) => {
                        setError(error.message);
                  });
      }, [email]);

      return (
            <div>
                  <h3>Trainings</h3>
                  {error && <p>{error}</p>}
                  {trainings.length === 0 ? (
                        <p>No training classes</p>
                  ) : (
                        <table>
                              <thead>
                                    <tr>
                                          <th>Date</th>
                                          <th>Distance</th>
                                          <th>Quantity shoots</th>
                                    </tr>
                              </thead>
                              <tbody>
                                    {trainings.map((training, index) => (
                                          <tr key={index}>
                                                <td>
                                                      {new Date(
                                                            training.date
                                                      ).toLocaleString()}
                                                </td>
                                                <td>{training.distance} m</td>
                                                <td>
                                                      {
                                                            training.quantity_of_shots
                                                      }
                                                </td>
                                          </tr>
                                    ))}
                              </tbody>
                        </table>
                  )}
            </div>
      );
};

export default GetTraining;
