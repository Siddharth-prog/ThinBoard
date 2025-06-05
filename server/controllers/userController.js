const userSessions = new Map();

export const handleSetUsername = (socket) => {
  return ({ username, avatar }, callback) => {
    if (!username || typeof username !== 'string' || username.trim().length < 2) {
      if (typeof callback === 'function') {
        return callback({ error: 'Username must be at least 2 characters' });
      } else {
        return socket.emit('set-username-error', { error: 'Username must be at least 2 characters' });
      }
    }

    if (!avatar || typeof avatar !== 'string') {
      if (typeof callback === 'function') {
        return callback({ error: 'Please select a valid avatar' });
      } else {
        return socket.emit('set-username-error', { error: 'Please select a valid avatar' });
      }
    }

    // Store user session
    userSessions.set(socket.id, { username, avatar });

    if (typeof callback === 'function') {
      callback({ success: true });
    } else {
      socket.emit('set-username-success', { username, avatar });
    }
  };
};


export const getUserSessions = () => userSessions;

export const removeUserSession = (socketId) => {
  userSessions.delete(socketId);
};
