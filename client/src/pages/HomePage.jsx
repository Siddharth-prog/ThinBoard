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
import { motion, AnimatePresence } from 'framer-motion';

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
  const [loading, setLoading] = useState(true);

  const { roomId: paramRoomId } = useParams();
  const [roomId, setRoomId] = useState(paramRoomId || '');
  const navigate = useNavigate();
  const socketRef = useRef(null);

  // Copy room ID
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Leave room
  const leaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit('leave-room', { roomId });
      socketRef.current.disconnect();
    }
    setRoomId('');
    navigate('/');
  };

  // Sync roomId from URL
  useEffect(() => {
    if (paramRoomId && paramRoomId !== roomId) {
      setRoomId(paramRoomId);
    }
  }, [paramRoomId]);

  // Load user once
  useEffect(() => {
    const savedUser = localStorage.getItem('whiteboardUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setTimeout(() => setLoading(false), 800); // Optional delay for smoother UX
  }, []);

  // Initialize socket once
  useEffect(() => {
    socketRef.current = io('https://thinkboard-backend-k7ec.onrender.com', {
      transports: ['websocket'],
      withCredentials: true,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Join room and listen for user list
  useEffect(() => {
    const socket = socketRef.current;
    if (!roomId || !user || !socket) return;

    const handleUserList = (users) => {
      setUserList(users);
    };

    socket.emit('join-room', { roomId, user });

    socket.on('user-list', handleUserList);

    return () => {
      socket.emit('leave-room', { roomId, userId: user.id || user.username });
      socket.off('user-list', handleUserList);
    };
  }, [roomId, user]);

  // 🔄 Loading Spinner with Fade Out
  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center h-screen bg-gray-100 text-gray-700 fixed inset-0 z-50"
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mx-auto mb-4"></div>
              <p className="text-lg font-medium">Loading...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && !user && <Auth setUser={setUser} />}
      {!loading && user && !roomId && (
        <Rooms setRoomId={setRoomId} socket={socketRef.current} user={user} />
      )}

      {!loading && user && roomId && (
        <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
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

          <main className="flex flex-1 overflow-hidden">
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
            <aside className="w-1/4 bg-white border-l shadow-lg flex flex-col overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Online Users ({userList.length})
                </h3>
                <Users users={userList} />
              </div>
              <div className="flex-1 flex flex-col overflow-hidden">
                <Chat socket={socketRef.current} roomId={roomId} />
              </div>
            </aside>
          </main>
        </div>
      )}
    </>
  );
};

export default HomePage;
