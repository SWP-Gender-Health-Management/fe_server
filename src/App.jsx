import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from '@components/Navbar/Navbar';
import LandingPage from '@pages/LandingPage/LandingPage';
import Login from '@pages/Login/Login';
import UserAccount from '@pages/UserAccount/UserAccount';
import '@styles/reset.css';

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <Router>
      <Navbar onLoginClick={() => setShowLogin(true)} />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tai-khoan" element={<UserAccount />} />
        {/* thêm route khác nếu cần */}
      </Routes>

      <Login visible={showLogin} onCancel={() => setShowLogin(false)} />
    </Router>
  );
}

export default App;
