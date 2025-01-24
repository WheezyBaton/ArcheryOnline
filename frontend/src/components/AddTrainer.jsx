import { useState } from "react";

const AddTrainer = () => {
      const [formData, setFormData] = useState({
            name: "",
            last_name: "",
            email: "",
            phone_number: "",
            license_number: "",
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
                        "http://127.0.0.1:5000/trainer/add",
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
                  setError("Unable to connect to the server", err);
            }
      };

      return (
            <div>
                  <h1>Add Trainer</h1>
                  {message && <p style={{ color: "green" }}>{message}</p>}
                  {error && <p style={{ color: "red" }}>{error}</p>}
                  <form onSubmit={handleSubmit}>
                        <div>
                              <label>Name:</label>
                              <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                              />
                        </div>
                        <div>
                              <label>Last Name:</label>
                              <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                              />
                        </div>
                        <div>
                              <label>Email:</label>
                              <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                              />
                        </div>
                        <div>
                              <label>Phone number:</label>
                              <input
                                    type="text"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    required
                              />
                        </div>
                        <div>
                              <label>License number:</label>
                              <input
                                    type="text"
                                    name="license_number"
                                    value={formData.license_number}
                                    onChange={handleChange}
                                    required
                              />
                        </div>
                        <div>
                              <label>Password:</label>
                              <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                              />
                        </div>
                        <button type="submit">Add Trainer</button>
                  </form>
            </div>
      );
};

export default AddTrainer;
