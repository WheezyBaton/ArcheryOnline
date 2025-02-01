import { useState } from "react";

const DeleteTrainer = ({ email }) => {
      const [statusMessage, setStatusMessage] = useState("");

      const handleDelete = async () => {
            try {
                  const response = await fetch(
                        `http://127.0.0.1:5000/trainer/discharge/${email}`,
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
                        "An error occurred. Please try again.",
                        error
                  );
            }
      };

      return (
            <div>
                  <button className="logout-button" onClick={handleDelete}>
                        Remove trainer from the club
                  </button>
                  {statusMessage && <p>{statusMessage}</p>}
            </div>
      );
};

export default DeleteTrainer;
