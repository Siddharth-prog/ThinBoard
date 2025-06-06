import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Auth from './components/Auth';
import { useState } from 'react';
import { MotionConfig } from 'framer-motion';
function App() {
  const [user, setUser] = useState(null);

  return (
    <MotionConfig>
    <Routes>
      <Route path="/" element={<Auth setUser={setUser} />} />
      <Route path="/homepage/:roomId" element={<HomePage />} />
    </Routes>
  </MotionConfig>
  );
}

export default App;
