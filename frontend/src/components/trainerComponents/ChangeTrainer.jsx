import { useState, useEffect } from "react";
import "../change.css";

const ChangeTrainer = ({ email }) => {
      const [formData, setFormData] = useState({
            name: "",
            last_name: "",
            new_email: "",
            phone_number: "",
            license_number: "",
      });
      const [placeholders, setPlaceholders] = useState({});
      const [message, setMessage] = useState("");
      const [loading, setLoading] = useState(false);

      useEffect(() => {
            fetch(`http://127.0.0.1:5000/trainer/personal_data/${email}`, {
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
                                    last_name: data.last_name || "",
                                    new_email: data.email || "",
                                    phone_number: data.phone_number || "",
                                    license_number: data.license_number || "",
                              });
                        }
                  })
                  .catch(() => {
                        setMessage("Failed to fetch user data.");
                  });
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
                        `http://127.0.0.1:5000/trainer/change/${email}`,
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
                        <label>
                              Phone number:
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
                              License number:
                              <input
                                    type="text"
                                    name="license_number"
                                    value={formData.license_number}
                                    onChange={handleInputChange}
                                    placeholder={
                                          placeholders.license_number ||
                                          "Enter license number"
                                    }
                              />
                        </label>

                        <button
                              className="nav-button"
                              type="submit"
                              disabled={loading}
                        >
                              {loading ? "Updating..." : "Update data"}
                        </button>
                  </form>
                  {message && <p>{message}</p>}
            </div>
      );
};

export default ChangeTrainer;
