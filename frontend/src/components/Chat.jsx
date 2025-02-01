import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./chat.css";

const socket = io("http://127.0.0.1:5000", {
      withCredentials: true,
      transports: ["websocket", "polling"],
});

socket.on("connect", () => {
      console.log("Połączono z serwerem WebSocket");
});

function Chat({ userEmail, userRole }) {
      const [message, setMessage] = useState("");
      const [messages, setMessages] = useState({});
      const [room, setRoom] = useState("");

      const rooms = {
            "Club Manager": ["Clubs Managers room", "Everyone"],
            Trainer: ["Trainers room", "Everyone"],
            Archer: ["Archers room", "Everyone"],
      };

      useEffect(() => {
            const handleMessage = (msg) => {
                  if (!msg.room) {
                        console.error("Message received without room: ", msg);
                        return;
                  }

                  console.log("Message received: ", msg);

                  setMessages((prevMessages) => {
                        return {
                              ...prevMessages,
                              [msg.room]: [
                                    ...(prevMessages[msg.room] || []),
                                    ...(prevMessages[msg.room]?.some(
                                          (m) => m.message_id === msg.message_id
                                    )
                                          ? []
                                          : [msg]),
                              ],
                        };
                  });
            };

            socket.off("message");
            socket.on("message", handleMessage);

            return () => {
                  socket.off("message", handleMessage);
            };
      }, []);

      const handleSendMessage = () => {
            if (!room || !message.trim()) return;

            const messageData = {
                  room: room,
                  message: message,
                  user_email: userEmail,
                  user_role: userRole,
                  message_id: Date.now(),
            };

            socket.emit("message", messageData);
            setMessage("");
      };

      const handleJoinRoom = (roomName) => {
            console.log("Sending a room join: ", roomName);

            if (room !== roomName) {
                  socket.emit("join", {
                        room: roomName,
                        user_role: userRole,
                        user_email: userEmail,
                  });
                  setRoom(roomName);
            } else {
                  console.log("Already in this room");
            }
      };

      const handleLeaveRoom = () => {
            socket.emit("leave", { room: room });
            setRoom("");
      };

      return (
            <div>
                  {userRole === "Club Manager" && (
                        <>
                              <button
                                    className="nav-button"
                                    onClick={() =>
                                          handleJoinRoom("Clubs Managers room")
                                    }
                              >
                                    Clubs Managers room
                              </button>
                              <button
                                    className="nav-button"
                                    onClick={() => handleJoinRoom("Everyone")}
                              >
                                    Everyone room
                              </button>
                        </>
                  )}

                  {userRole === "Trainer" && (
                        <>
                              <button
                                    className="nav-button"
                                    onClick={() =>
                                          handleJoinRoom("Trainers room")
                                    }
                              >
                                    Trainers room
                              </button>
                              <button
                                    className="nav-button"
                                    onClick={() => handleJoinRoom("Everyone")}
                              >
                                    Everyone room
                              </button>
                        </>
                  )}

                  {userRole === "Archer" && (
                        <>
                              <button
                                    className="nav-button"
                                    onClick={() =>
                                          handleJoinRoom("Archers room")
                                    }
                              >
                                    Archers room
                              </button>
                              <button
                                    className="nav-button"
                                    onClick={() => handleJoinRoom("Everyone")}
                              >
                                    Everyone room
                              </button>
                        </>
                  )}

                  {room && (
                        <>
                              <button
                                    className="logout-button"
                                    onClick={handleLeaveRoom}
                              >
                                    Leave room
                              </button>
                              <div>
                                    <h3>Messages in {room}</h3>
                                    {messages[room] &&
                                    messages[room].length > 0 ? (
                                          messages[room].map((msg, index) => {
                                                const isMyMessage =
                                                      msg.user_email ===
                                                      userEmail;

                                                return (
                                                      <div
                                                            key={index}
                                                            className={`message-container ${
                                                                  isMyMessage
                                                                        ? "my-message"
                                                                        : "other-message"
                                                            }`}
                                                      >
                                                            <div className="message-bubble">
                                                                  <strong>
                                                                        {
                                                                              msg.user_email
                                                                        }{" "}
                                                                        (
                                                                        {
                                                                              msg.user_role
                                                                        }
                                                                        ):
                                                                  </strong>{" "}
                                                                  {msg.message}
                                                            </div>
                                                      </div>
                                                );
                                          })
                                    ) : (
                                          <p>No messages in {room}</p>
                                    )}
                                    <div>
                                          <input
                                                type="text"
                                                value={message}
                                                onChange={(e) =>
                                                      setMessage(e.target.value)
                                                }
                                                placeholder="Type a message"
                                          />
                                          <button
                                                className="nav-button"
                                                onClick={handleSendMessage}
                                          >
                                                Send
                                          </button>
                                    </div>
                              </div>
                        </>
                  )}
            </div>
      );
}

export default Chat;
