import { useState, useEffect } from "react";
import { decodeToken } from "./../utils/decodeToken";

const GetTraining = () => {
      const [trainings, setTrainings] = useState([]);
      const [error, setError] = useState(null);

      useEffect(() => {
            const token = localStorage.getItem("token");

            if (token) {
                  const decoded = decodeToken(token);
                  const email = decoded.email;

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
            } else {
                  setError("Brak tokena. Zaloguj się ponownie.");
            }
      }, []);

      return (
            <div>
                  <h2>Twoje Treningi</h2>
                  {error && <p>{error}</p>}
                  {trainings.length === 0 ? (
                        <p>Brak dostępnych treningów.</p>
                  ) : (
                        <table>
                              <thead>
                                    <tr>
                                          <th>Data</th>
                                          <th>Dystans</th>
                                          <th>Ilość strzałów</th>
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
