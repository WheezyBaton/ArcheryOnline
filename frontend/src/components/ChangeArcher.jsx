import { useState, useEffect } from "react";
import { decodeToken } from "./../utils/decodeToken";

const ChangeArcher = () => {
      const [email, setEmail] = useState("");
      const [formData, setFormData] = useState({
            name: "",
            last_name: "",
            birth_year: "",
            gender: "",
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

                  fetch(
                        `http://127.0.0.1:5000/archer/personal_data/${userEmail}`,
                        {
                              method: "GET",
                              headers: {
                                    "Content-Type": "application/json",
                              },
                        }
                  )
                        .then((response) => response.json())
                        .then((data) => {
                              if (data) {
                                    setPlaceholders(data);
                                    setFormData({
                                          name: data.name || "",
                                          last_name: data.last_name || "",
                                          birth_year: data.birth_year || "",
                                          gender: data.gender || "",
                                          new_email: data.email || "",
                                    });
                              }
                        })
                        .catch(() => {
                              setMessage("Failed to fetch user data.");
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
                        `http://127.0.0.1:5000/archer/change/${email}`,
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
                  setMessage("Failed to update user data.", error);
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div>
                  <h2>Change Archer Data</h2>
                  <form onSubmit={handleSubmit}>
                        <label>
                              Name:
                              <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder={
                                          placeholders.name || "Enter name"
                                    }
                              />
                        </label>
                        <label>
                              Last Name:
                              <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    placeholder={
                                          placeholders.last_name ||
                                          "Enter last name"
                                    }
                              />
                        </label>
                        <label>
                              Birth Year:
                              <input
                                    type="number"
                                    name="birth_year"
                                    value={formData.birth_year}
                                    onChange={handleInputChange}
                                    placeholder={
                                          placeholders.birth_year ||
                                          "Enter birth year"
                                    }
                                    min="1900"
                                    max="2100"
                              />
                        </label>
                        <label>
                              Gender:
                              <input
                                    type="text"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    placeholder={
                                          placeholders.gender || "Enter gender"
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

export default ChangeArcher;
