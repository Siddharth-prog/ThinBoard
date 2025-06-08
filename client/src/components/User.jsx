import React from 'react';

export const Users = ({ users }) => {
  return (
    <div className="bg-white p-3 border rounded h-[300px] overflow-y-scroll">
      <h3 className="font-semibold mb-2">Players in Room</h3>
      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.id || user.username} // Use unique id or username as key
            className="flex items-center gap-3"
          >
            <img
              src={user.avatar}
              alt={`${user.username}'s avatar`}
              className="w-8 h-8 rounded-full border"
            />
            <span className="font-medium">{user.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
