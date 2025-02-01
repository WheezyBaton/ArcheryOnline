import { useState } from "react";
import "../Home/home.css";

const DeleteArcher = ({ email }) => {
      const [message, setMessage] = useState("");

      const deleteAccount = async (email) => {
            const response = await fetch(
                  `http://127.0.0.1:5000/account/delete/${email}`,
                  {
                        method: "DELETE",
                        headers: {
                              "Content-Type": "application/json",
                        },
                  }
            );

            if (response.ok) {
                  const data = await response.json();
                  setMessage(data.message);
                  localStorage.removeItem("token");
            } else {
                  setMessage("Failed to delete account. Please try again.");
            }
      };

      deleteAccount(email);

      return (
            <div>
                  <h2>Delete Account</h2>
                  {message && <p>{message}</p>}
            </div>
      );
};

export default DeleteArcher;
