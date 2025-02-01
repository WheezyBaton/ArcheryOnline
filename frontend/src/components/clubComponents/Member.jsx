import { useState } from "react";
import ArcherList from "./../ArcherList";
import TrainerList from "./../TrainerList";
import AssignArcher from "./AssignArcher";
import AssignTrainer from "./AssignTrainer";

const Member = ({ email, role }) => {
      const [showAssignArcher, setShowAssignArcher] = useState(false);
      const [showAssignTrainer, setShowAssignTrainer] = useState(false);
      const [activeSection, setActiveSection] = useState("");

      const toggleAssignArcher = () => {
            setShowAssignArcher((prev) => !prev);
      };

      const toggleAssignTrainer = () => {
            setShowAssignTrainer((prev) => !prev);
      };

      return (
            <div>
                  <div style={{ marginTop: "8px" }}>
                        <button
                              className="nav-button"
                              onClick={() => setActiveSection("Archers")}
                        >
                              Archers
                        </button>
                        <button
                              className="nav-button"
                              onClick={() => setActiveSection("Trainers")}
                        >
                              Trainers
                        </button>
                  </div>

                  {activeSection === "Archers" && (
                        <div>
                              <div style={{ marginTop: "8px" }}>
                                    <button
                                          className="nav-button"
                                          onClick={toggleAssignArcher}
                                    >
                                          {showAssignArcher
                                                ? "Hide Assign Archer"
                                                : "Show Assign Archer"}
                                    </button>
                                    {showAssignArcher && (
                                          <AssignArcher clubEmail={email} />
                                    )}
                              </div>
                              <ArcherList email={email} role={role} />
                        </div>
                  )}

                  {activeSection === "Trainers" && (
                        <div>
                              <div style={{ marginTop: "8px" }}>
                                    <button
                                          className="nav-button"
                                          onClick={toggleAssignTrainer}
                                    >
                                          {showAssignTrainer
                                                ? "Hide Assign Trainer"
                                                : "Show Assign Trainer"}
                                    </button>
                                    {showAssignTrainer && (
                                          <AssignTrainer clubEmail={email} />
                                    )}
                              </div>
                              <TrainerList email={email} />
                        </div>
                  )}
            </div>
      );
};

export default Member;
