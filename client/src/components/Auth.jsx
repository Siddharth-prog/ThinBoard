import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:8000", {
  withCredentials: true,
  transports: ["websocket"],
});

const avatars = [
  "https://cdn-icons-png.flaticon.com/512/4333/4333609.png",
  "https://cdn-icons-png.flaticon.com/512/4333/4333617.png",
  "https://cdn-icons-png.flaticon.com/512/4333/4333635.png",
  "https://cdn-icons-png.flaticon.com/512/4333/4333638.png",
  "https://cdn-icons-png.flaticon.com/512/4333/4333645.png",
  "https://cdn-icons-png.flaticon.com/512/4333/4333653.png",
];

const Auth = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [roomIdInput, setRoomIdInput] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const userData = {
    username: username.trim(),
    avatar: avatars[avatarIndex],
  };

  const validateUser = () => {
    if (!userData.username) {
      setError("Please enter a username");
      return false;
    }
    return true;
  };

  const handleCreateRoom = () => {
    if (!validateUser()) return;

    socket.emit("create-room", userData, (response) => {
      if (response.error) {
        setError(response.error);
      } else {
        localStorage.setItem("whiteboardUser", JSON.stringify(userData));
        setUser(userData);
        navigate(`/homepage/${response.roomId}`);
      }
    });
  };

  const handleJoinRoom = () => {
    if (!validateUser()) return;

    if (!roomIdInput.trim()) {
      setError("Please enter a room ID");
      return;
    }

    socket.emit(
      "join-room",
      { ...userData, roomId: roomIdInput.trim() },
      (response) => {
        if (response.error) {
          setError(response.error);
        } else {
          localStorage.setItem("whiteboardUser", JSON.stringify(userData));
          setUser(userData);
          navigate(`/homepage/${response.roomId}`);
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
        <h1 className="text-4xl font-bold text-center">
          {"Thinkboard".split("").map((char, i) => (
            <span
              key={i}
              className="inline-block animate-jump"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {char}
            </span>
          ))}
        </h1>

        {error && <p className="text-red-600 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() =>
              setAvatarIndex(
                (avatarIndex - 1 + avatars.length) % avatars.length
              )
            }
          >
            ⬅️
          </button>
          <img
            src={avatars[avatarIndex]}
            alt="avatar"
            className="w-20 h-20 rounded-full border-4 border-blue-400"
          />
          <button
            onClick={() => setAvatarIndex((avatarIndex + 1) % avatars.length)}
          >
            ➡️
          </button>
        </div>

        <button
          onClick={handleCreateRoom}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-md hover:bg-indigo-700 transition"
        >
          ➕ Create New Room
        </button>

        <div className="border-t pt-4 space-y-3">
          <input
            type="text"
            placeholder="Enter Room ID to Join"
            value={roomIdInput}
            onChange={(e) => setRoomIdInput(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleJoinRoom}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
