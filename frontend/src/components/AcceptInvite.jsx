import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const AcceptInvite = () => {
      const [invites, setInvites] = useState([]);

      useEffect(() => {
            const socket = io("http://127.0.0.1:5000");

            socket.on("zaproszenie_klubowe", (invite) => {
                  setInvites((prev) => [...prev, invite]);
            });

            return () => socket.disconnect();
      }, []);

      const acceptInvite = async (email, userType, clubEmail) => {
            const response = await fetch(
                  `http://127.0.0.1:5000/accept-invite/${email}/${userType}/${clubEmail}`,
                  { method: "POST" }
            );
            if (response.ok) {
                  alert("Invitation accepted!");
                  setInvites((prev) =>
                        prev.filter((inv) => inv.email !== email)
                  );
            } else {
                  alert("The invitation could not be accepted.");
            }
      };

      return (
            <div>
                  <ul>
                        {invites.map((invite, index) => (
                              <li key={index}>
                                    {invite.name} ({invite.user_type})
                                    zaproszony do {invite.club_name}.
                                    <button
                                          className="nav-button"
                                          onClick={() =>
                                                acceptInvite(
                                                      invite.email,
                                                      invite.user_type,
                                                      invite.club_email
                                                )
                                          }
                                    >
                                          Accept!
                                    </button>
                              </li>
                        ))}
                  </ul>
            </div>
      );
};

export default AcceptInvite;
