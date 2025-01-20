import { useState } from "react";

const AddArcher = () => {
      const [name, setName] = useState("");
      const [lastName, setLastName] = useState("");
      const [birthYear, setBirthYear] = useState("");
      const [gender, setGender] = useState("");
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [message, setMessage] = useState("");

      const handleAddArcher = async (e) => {
            e.preventDefault();

            const archerData = {
                  name,
                  last_name: lastName,
                  birth_year: birthYear,
                  gender,
                  email,
                  password,
            };

            const response = await fetch("http://127.0.0.1:5000/archer/add", {
                  method: "POST",
                  headers: {
                        "Content-Type": "application/json",
                  },
                  body: JSON.stringify(archerData),
            });

            if (response.ok) {
                  const data = await response.json();
                  setMessage(data.message);
            } else {
                  const errorData = await response.json();
                  setMessage(errorData.message || "An error occurred");
            }
      };

      return (
            <div>
                  <h2>Add New Archer</h2>
                  <form onSubmit={handleAddArcher}>
                        <div>
                              <label>Name:</label>
                              <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                              />
                        </div>
                        <div>
                              <label>Last Name:</label>
                              <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) =>
                                          setLastName(e.target.value)
                                    }
                                    required
                              />
                        </div>
                        <div>
                              <label>Birth Year:</label>
                              <input
                                    type="number"
                                    value={birthYear}
                                    onChange={(e) =>
                                          setBirthYear(e.target.value)
                                    }
                                    required
                              />
                        </div>
                        <div>
                              <label>Gender:</label>
                              <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    required
                              >
                                    <option>Other</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                              </select>
                        </div>
                        <div>
                              <label>Email:</label>
                              <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                              />
                        </div>
                        <div>
                              <label>Password:</label>
                              <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                          setPassword(e.target.value)
                                    }
                                    required
                              />
                        </div>
                        <button type="submit">Add Archer</button>
                  </form>
                  {message && <p>{message}</p>}{" "}
            </div>
      );
};

export default AddArcher;
