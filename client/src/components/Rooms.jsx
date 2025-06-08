import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

const Rooms = ({ setRoomId, socket, user }) => {
  const [inputRoomId, setInputRoomId] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const joinRoom = () => {
    if (!inputRoomId.trim()) {
      setError('Please enter a room ID');
      return;
    }

    socket.emit(
      'join-room',
      {
        username: user.username,
        avatar: user.avatar,
        roomId: inputRoomId.trim(),
      },
      (response) => {
        if (response.error) {
          setError(response.error);
        } else {
          setRoomId(response.roomId);
          navigate(`/homepage/${response.roomId}`);
        }
      }
    );
  };

  const createRoom = () => {
    setError('');
    socket.emit(
      'create-room',
      {
        username: user.username,
        avatar: user.avatar,
      },
      (response) => {
        if (response.error) {
          setError(response.error);
        } else {
          setRoomId(response.roomId);
          setInputRoomId(response.roomId);
          navigate(`/homepage/${response.roomId}`);
        }
      }
    );
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">ThinkBoard</h1>

        <button
          onClick={createRoom}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-md shadow hover:bg-indigo-700 transition"
        >
          ➕ Create New Room
        </button>

        <div className="space-y-2">
          <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">
            Or join with an existing Room ID
          </label>
          <div className="flex">
            <input
              id="roomId"
              type="text"
              placeholder="Enter Room ID"
              value={inputRoomId}
              onChange={(e) => {
                setInputRoomId(e.target.value);
                setError('');
              }}
              className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring focus:border-blue-400"
            />
            <button
              onClick={joinRoom}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition"
            >
              Join
            </button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {inputRoomId && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-gray-600 mb-2">Share this Room ID:</p>
            <div className="flex items-center">
              <input
                type="text"
                value={inputRoomId}
                readOnly
                className="flex-grow px-2 py-1 border border-gray-300 rounded-l-md text-sm bg-white"
              />
              <CopyToClipboard text={inputRoomId} onCopy={() => setIsCopied(true)}>
                <button className="bg-blue-500 text-white px-3 py-2 rounded-r-md hover:bg-blue-600 transition text-sm">
                  {isCopied ? 'Copied!' : 'Copy'}
                </button>
              </CopyToClipboard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
