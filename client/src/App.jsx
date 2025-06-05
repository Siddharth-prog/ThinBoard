import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Auth from './components/Auth';
import { useState } from 'react';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<Auth setUser={setUser} />} />
      <Route path="/homepage/:roomId" element={<HomePage />} />
    </Routes>
  );
}

export default App;
