// Users.jsx
export const Users = ({ users }) => {
    return (
      <div>
        <h3 className="font-semibold mb-2">Players in Room</h3>
        <ul className="mb-4 space-y-2">
          {users.map((user, index) => (
            <li key={index} className="flex items-center gap-3">
              <img 
                src={user.avatar} 
                alt="avatar" 
                className="w-8 h-8 rounded-full border" 
              />
              <span className="font-medium">{user.username}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  