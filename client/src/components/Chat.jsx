import React, { useState, useEffect } from 'react';

function Chat({ socket, roomId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!socket) return;

    socket.on('chat-message', ({ sender, avatar, message, timestamp }) => {
      setMessages((prev) => [...prev, { sender, avatar, message, timestamp }]);
    });

    return () => {
      socket.off('chat-message');
    };
  }, [socket]);

  const sendMessage = () => {
    if (input.trim() === '') return;

    socket.emit('chat-message', { roomId, message: input });

    // Optional: Show "You" message locally
    setMessages((prev) => [
      ...prev,
      {
        sender: 'You',
        avatar: localStorage.getItem('avatar'),
        message: input,
        timestamp: new Date(),
      },
    ]);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="bg-white border p-2 mt-4 h-[300px] overflow-y-scroll">
      <h3 className="font-semibold mb-2">Chat</h3>
      <div className="space-y-2 mb-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {msg.avatar && (
              <img src={msg.avatar} alt="avatar" className="w-6 h-6 rounded-full" />
            )}
            <div>
              <strong>{msg.sender}</strong>: {msg.message}
            </div>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type a message..."
        className="w-full border px-2 py-1"
      />
    </div>
  );
}

export default Chat;
