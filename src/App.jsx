import React, { useState } from 'react';
import Navbar from '@components/Navbar';
import LandingPage from '@pages/LandingPage';
import './reset.css';
import Login from '@pages/Login';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <div>
      <Navbar onLoginClick={() => setShowLogin(true)} />
      <LandingPage />
      <Login visible={showLogin} onCancel={() => setShowLogin(false)} />
    </div>
  );
}

export default App;
