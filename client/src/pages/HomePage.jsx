import React, { useEffect, useState, useRef } from 'react';
import Toolbar from '@/components/Toolbar';
import Chat from '@/components/Chat';
import Export from '@/components/Export';
import { Users } from '@/components/User';
import Rooms from '@/components/Rooms';
import Auth from '@/components/Auth';
import Canvas from '@/components/Canvas';
import { io } from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Simple SVG icons
const CopyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const LeaveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const HomePage = () => {
  const [selectedTool, setSelectedTool] = useState('brush');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(10);
  const [userList, setUserList] = useState([]);
  const [user, setUser] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const { roomId: paramRoomId } = useParams();
  const [roomId, setRoomId] = useState(paramRoomId || '');
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const leaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit('leave-room', { roomId }); // Add roomId here
      socketRef.current.disconnect();
    }
    setRoomId('');
    navigate('/');
  };

  useEffect(() => {
    if (paramRoomId && paramRoomId !== roomId) {
      setRoomId(paramRoomId);
    }
  }, [paramRoomId]);

  useEffect(() => {
    socketRef.current = io('http://localhost:8000', {
      transports: ['websocket'],
      withCredentials: true,
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
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

      socket.on('user-list', (users) => {
        // Filter out duplicate users
        const uniqueUsers = users.filter(
          (user, index, self) => index === self.findIndex((u) => u.id === user.id)
        );
        setUserList(uniqueUsers);
      });

      return () => {
        socket.off('user-list');
      };
    }
  }, [roomId]);

  if (!user) return <Auth setUser={setUser} />;
  if (!roomId) return <Rooms setRoomId={setRoomId} socket={socketRef.current} user={user} />;

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-6 py-3 bg-white shadow-md z-10">
        <Toolbar
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
        />
        
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={leaveRoom}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition-colors"
          >
            <LeaveIcon />
            Leave Room
          </motion.button>
          
          {roomId && (
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-800 px-4 py-2 rounded-lg">
              <span className="font-medium">Room:</span>
              <span className="font-mono">{roomId}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={copyRoomId}
                className="text-indigo-600 hover:text-indigo-800 transition-colors"
                title="Copy to clipboard"
              >
                <CopyIcon />
              </motion.button>
              {isCopied && (
                <motion.span 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xs text-green-600 ml-1"
                >
                  Copied!
                </motion.span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 overflow-hidden">
        {/* Canvas Area (3/4 width) */}
        <div className="w-3/4 flex flex-col h-full bg-white shadow-inner">
          <div className="flex-1 relative overflow-hidden">
            <Canvas
              selectedTool={selectedTool}
              selectedColor={selectedColor}
              brushSize={brushSize}
              socket={socketRef.current}
              roomId={roomId}
            />
          </div>
          <div className="p-3 bg-gray-50 border-t">
            <Export />
          </div>
        </div>

        {/* Sidebar (1/4 width) */}
        <aside className="w-1/4 bg-white border-l shadow-lg flex flex-col overflow-hidden">
          {/* Users Section */}
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-700 mb-2">
              Online Users ({userList.length})
            </h3>
            <Users users={userList} />
          </div>
          
          {/* Chat Section - Now takes full remaining height */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Chat socket={socketRef.current} roomId={roomId} />
          </div>
        </aside>
      </main>
    </div>
  );
};

export default HomePage;