import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const Zaproszenia = () => {
      const [zaproszenia, setZaproszenia] = useState([]);

      useEffect(() => {
            const socket = io("http://127.0.0.1:5000");

            socket.on("zaproszenie_klubowe", (zaproszenie) => {
                  setZaproszenia((prev) => [...prev, zaproszenie]);
            });

            return () => socket.disconnect();
      }, []);

      const zaakceptujZaproszenie = async (email, userType, clubEmail) => {
            const response = await fetch(
                  `http://127.0.0.1:5000/accept-invite/${email}/${userType}/${clubEmail}`,
                  { method: "POST" }
            );
            if (response.ok) {
                  alert("Zaproszenie zaakceptowane!");
                  setZaproszenia((prev) =>
                        prev.filter((zap) => zap.email !== email)
                  );
            } else {
                  alert("Nie udało się zaakceptować zaproszenia.");
            }
      };

      return (
            <div>
                  <h2>Zaproszenia do Klubu</h2>
                  <ul>
                        {zaproszenia.map((zaproszenie, index) => (
                              <li key={index}>
                                    {zaproszenie.name} ({zaproszenie.user_type})
                                    zaproszony do {zaproszenie.club_name}.
                                    <button
                                          onClick={() =>
                                                zaakceptujZaproszenie(
                                                      zaproszenie.email,
                                                      zaproszenie.user_type,
                                                      zaproszenie.club_email
                                                )
                                          }
                                    >
                                          Zaakceptuj
                                    </button>
                              </li>
                        ))}
                  </ul>
            </div>
      );
};

export default Zaproszenia;
