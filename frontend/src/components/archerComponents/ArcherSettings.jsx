import ChangeArcher from "./ChangeArcher";

const ArcherSettings = ({ email }) => {
      const handleDeleteAccount = async () => {
            const confirmation = window.confirm(
                  "Are you sure you want to delete your account? This action cannot be undone."
            );

            if (confirmation) {
                  try {
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
                              alert(data.message);
                              localStorage.removeItem("token");
                        } else {
                              alert(
                                    "Failed to delete account. Please try again."
                              );
                        }
                  } catch (error) {
                        alert("An error occurred. Please try again.");
                  }
            }
      };

      return (
            <div>
                  <ChangeArcher email={email} />
                  <button
                        className="logout-button"
                        onClick={handleDeleteAccount}
                  >
                        Delete account
                  </button>
            </div>
      );
};

export default ArcherSettings;
