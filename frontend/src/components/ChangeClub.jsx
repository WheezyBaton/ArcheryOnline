import { useState, useEffect } from "react";
import { decodeToken } from "./../utils/decodeToken";

const ChangeClub = () => {
      const [email, setEmail] = useState("");
      const [formData, setFormData] = useState({
            name: "",
            address: "",
            phone_number: "",
            new_email: "",
      });
      const [placeholders, setPlaceholders] = useState({});
      const [message, setMessage] = useState("");
      const [loading, setLoading] = useState(false);

      useEffect(() => {
            const token = localStorage.getItem("token");
            if (token) {
                  const decoded = decodeToken(token);
                  const userEmail = decoded.email;
                  setEmail(userEmail);

                  fetch(`http://127.0.0.1:5000/club/${userEmail}`, {
                        method: "GET",
                        headers: {
                              "Content-Type": "application/json",
                        },
                  })
                        .then((response) => response.json())
                        .then((data) => {
                              if (data) {
                                    setPlaceholders(data);
                                    setFormData({
                                          name: data.name || "",
                                          address: data.address || "",
                                          phone_number: data.phone_number || "",
                                          new_email: data.email || "",
                                    });
                              }
                        })
                        .catch(() => {
                              setMessage("Failed to fetch club data.");
                        });
            } else {
                  setMessage("No token found. Please log in.");
            }
      }, []);

      const handleInputChange = (e) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
      };

      const handleSubmit = async (e) => {
            e.preventDefault();

            setLoading(true);
            try {
                  const response = await fetch(
                        `http://127.0.0.1:5000/club/change/${email}`,
                        {
                              method: "PUT",
                              headers: {
                                    "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                    ...formData,
                                    email: formData.new_email,
                              }),
                        }
                  );

                  const data = await response.json();

                  if (response.ok) {
                        setMessage(data.message);
                  } else {
                        setMessage(data.message || "An error occurred.");
                  }
            } catch (error) {
                  setMessage("Failed to update club data.");
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div>
                  <h2>Change Club Data</h2>
                  <form onSubmit={handleSubmit}>
                        <label>
                              Name:
                              <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder={
                                          placeholders.name || "Enter club name"
                                    }
                              />
                        </label>
                        <label>
                              Address:
                              <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder={
                                          placeholders.address ||
                                          "Enter address"
                                    }
                              />
                        </label>
                        <label>
                              Phone Number:
                              <input
                                    type="text"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleInputChange}
                                    placeholder={
                                          placeholders.phone_number ||
                                          "Enter phone number"
                                    }
                              />
                        </label>
                        <label>
                              Email:
                              <input
                                    type="email"
                                    name="new_email"
                                    value={formData.new_email}
                                    onChange={handleInputChange}
                                    placeholder={
                                          placeholders.email ||
                                          "Enter new email"
                                    }
                              />
                        </label>
                        <button type="submit" disabled={loading}>
                              {loading ? "Updating..." : "Update Data"}
                        </button>
                  </form>
                  {message && <p>{message}</p>}
            </div>
      );
};

export default ChangeClub;
