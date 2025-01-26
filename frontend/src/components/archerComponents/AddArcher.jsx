import { useState } from "react";

const AddArcher = () => {
      const [formData, setFormData] = useState({
            name: "",
            last_name: "",
            birth_year: "",
            gender: "",
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
                        "http://127.0.0.1:5000/archer/add",
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
                  <h1>Add Archer</h1>
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
                              <label>Birth Year:</label>
                              <input
                                    type="number"
                                    name="birth_year"
                                    value={formData.birth_year}
                                    onChange={handleChange}
                                    required
                              />
                        </div>
                        <div>
                              <label>Gender:</label>
                              <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                              >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                              </select>
                        </div>
                        <div>
                              <label>Email:</label>
                              <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
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
                        <button type="submit">Add Archer</button>
                  </form>
            </div>
      );
};

export default AddArcher;
