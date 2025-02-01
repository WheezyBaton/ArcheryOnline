import { useState } from "react";

const DischargeArcher = ({ email }) => {
      const [statusMessage, setStatusMessage] = useState("");

      const handleDelete = async () => {
            const confirmation = window.confirm(
                  "Are you sure you want to remove the archer from the club?"
            );

            if (confirmation) {
                  try {
                        const response = await fetch(
                              `http://127.0.0.1:5000/archer/discharge/${email}`,
                              {
                                    method: "DELETE",
                                    headers: {
                                          "Content-Type": "application/json",
                                    },
                              }
                        );

                        const data = await response.json();

                        if (response.ok) {
                              setStatusMessage(data.message);
                        } else {
                              setStatusMessage(data.message);
                        }
                  } catch (error) {
                        setStatusMessage(
                              "An error occurred. Please try again."
                        );
                  }
            }
      };

      return (
            <div>
                  <button className="logout-button" onClick={handleDelete}>
                        Remove the archer from the club
                  </button>
                  {statusMessage && <p>{statusMessage}</p>}
            </div>
      );
};

export default DischargeArcher;
