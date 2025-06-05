import React, { useState } from 'react';
import Navbar from '@components/Navbar';
import LandingPage from '@pages/LandingPage/LandingPage';
import '@styles/reset.css';
import Login from '@pages/Login/Login';
import UserAccount from '@pages/UserAccount/UserAccount';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <div>
      <Navbar onLoginClick={() => setShowLogin(true)} />
      <LandingPage />
      <UserAccount />
      <Login visible={showLogin} onCancel={() => setShowLogin(false)} />
    </div>
  );
}
export default App;