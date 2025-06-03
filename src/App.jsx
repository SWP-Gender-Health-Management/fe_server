import React, { useState } from 'react';
import Navbar from '@components/Navbar';
import LandingPage from '@pages/LandingPage';
import './reset.css';
import Login from '@pages/Login';
import UserAccount from '@pages/UserAccount';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <div>
      <Navbar onLoginClick={() => setShowLogin(true)} />
      <LandingPage />
      {/* <UserAccount /> */}
      <Login visible={showLogin} onCancel={() => setShowLogin(false)} />
    </div>
  );
}
export default App;