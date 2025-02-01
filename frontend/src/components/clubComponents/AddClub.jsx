import { useState } from "react";
import "../addUser.css";

const AddClub = () => {
      const [formData, setFormData] = useState({
            name: "",
            address: "",
            phone_number: "",
            email: "",
            password: "",
      });

      const [message, setMessage] = useState("");
      const [error, setError] = useState("");

      const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            setMessage("");
            setError("");

            try {
                  const response = await fetch(
                        "http://127.0.0.1:5000/club/add",
                        {
                              method: "POST",
                              headers: {
                                    "Content-Type": "application/json",
                              },
                              body: JSON.stringify(formData),
                        }
                  );

                  if (response.ok) {
                        const data = await response.json();
                        setMessage(data.message);
                  } else {
                        const errorData = await response.json();
                        setError(errorData.message || "An error occurred");
                  }
            } catch (err) {
                  setError("Unable to connect to the server");
            }
      };

      return (
            <div>
                  {message && <p style={{ color: "green" }}>{message}</p>}
                  {error && <p style={{ color: "red" }}>{error}</p>}
                  <form onSubmit={handleSubmit}>
                        <div className="form-group">
                              <label className="form-group-label">Name:</label>
                              <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                              />
                        </div>
                        <div className="form-group">
                              <label className="form-group-label">
                                    Address:
                              </label>
                              <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                              />
                        </div>
                        <div className="form-group">
                              <label className="form-group-label">
                                    Phone Number:
                              </label>
                              <input
                                    type="text"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    required
                              />
                        </div>
                        <div className="form-group">
                              <label className="form-group-label">Email:</label>
                              <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                              />
                        </div>
                        <div className="form-group">
                              <label className="form-group-label">
                                    Password:
                              </label>
                              <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                              />
                        </div>
                        <button className="nav-button" type="submit">
                              Create account
                        </button>
                  </form>
            </div>
      );
};

export default AddClub;
