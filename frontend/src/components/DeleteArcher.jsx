import { useState, useEffect } from "react";
import { decodeToken } from "./../utils/decodeToken";

export default function DeleteArcher() {
      const [message, setMessage] = useState("");

      useEffect(() => {
            const token = localStorage.getItem("token");
            if (token) {
                  const decoded = decodeToken(token);
                  const email = decoded.email;
                  deleteAccount(email);
            } else {
                  setMessage("No token found. Please log in.");
            }
      }, []);

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

      return (
            <div>
                  <h2>Delete Account</h2>
                  {message && <p>{message}</p>}
            </div>
      );
}
