import React, { useEffect, useState, useRef } from 'react';
import Toolbar from '@/components/Toolbar';
import Chat from '@/components/Chat';
import Export from '@/components/Export';
import { Users } from '@/components/User';
import Rooms from '@/components/Rooms';
import Auth from '@/components/Auth';
import Canvas from '@/components/Canvas';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';

const HomePage = () => {
  const [selectedTool, setSelectedTool] = useState('brush');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(10);
 
  const [word, setWord] = useState('');
  const [timer, setTimer] = useState(180);
  const [userList, setUserList] = useState([]);
  const [user, setUser] = useState(null);

  const { roomId: paramRoomId } = useParams();

  const [roomId, setRoomId] = useState(paramRoomId || '');

  const socketRef = useRef(null);

  useEffect(() => {
    if (paramRoomId && paramRoomId !== roomId) {
      setRoomId(paramRoomId);
    }
  }, [paramRoomId]);
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
  
    socket.on('connect', () => {
      const savedUser = JSON.parse(localStorage.getItem('whiteboardUser'));
      if (savedUser && roomId) {
        socket.emit('reconnect-user', {
          username: savedUser.username,
          avatar: savedUser.avatar,
          roomId
        });
      }
    });
  }, [roomId]);
  
  useEffect(() => {
    socketRef.current = io('http://localhost:8000', {
      transports: ['websocket'],
      withCredentials: true,
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (user && socket) {
      socket.emit('set-username', {
        username: user.username,
        avatar: user.avatar,
      });
    }
  }, [user]);

  useEffect(() => {
    const savedUser = localStorage.getItem('whiteboardUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (roomId && socket) {
      socket.emit('join-room', { roomId }, (response) => {
        if (response?.error) {
          alert(response.error);
          setRoomId('');
        }
      });

      socket.on('assign-word', setWord);
      socket.on('start-timer', setTimer);
      socket.on('user-list', setUserList);

      return () => {
        socket.off('assign-word');
        socket.off('start-timer');
        socket.off('user-list');
      };
    }
  }, [roomId]);

  if (!user) return <Auth setUser={setUser} />;

  if (!roomId)
    return <Rooms setRoomId={setRoomId} socket={socketRef.current} user={user} />;

  return (
    <div className="flex h-screen">
      <div className="w-3/4 flex flex-col">
        <Toolbar
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
        />
        <button
            onClick={() => {
            socketRef.current.emit('leave-room', () => {
              setRoomId('');
            });
      }}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
  Leave Room
</button>

{roomId && (
  <div className="bg-blue-100 border border-blue-400 text-blue-800 px-4 py-2 rounded m-4 flex items-center justify-between w-fit">
    <div>
      <strong>Room ID:</strong> {roomId}
    </div>
    <button
      onClick={() => {
        navigator.clipboard.writeText(roomId);
      }}
      className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
    >
      Copy
    </button>
  </div>
)}

        <Canvas
          selectedTool={selectedTool}
          selectedColor={selectedColor}
          brushSize={brushSize}
          socket={socketRef.current}
          roomId={roomId}
        />
        <div className="flex justify-between items-center px-4 py-2">
          <Export />
        </div>
      </div>

      <div className="w-1/4 p-4 border-l border-gray-200 flex flex-col">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Word: {word}</h2>
          <h3 className="text-md mb-2">Time left: {timer}s</h3>
        </div>
        <Users users={userList} socket={socketRef.current} />
        <Chat socket={socketRef.current} roomId={roomId} />
      </div>
    </div>
  );
};

export default HomePage;
