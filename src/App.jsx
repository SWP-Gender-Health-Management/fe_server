import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@components/Navbar/Navbar';
import LandingPage from '@pages/LandingPage/LandingPage';
import Login from '@pages/Login/Login';
import UserAccount from '@pages/UserAccount/UserAccount';
import AdminDashboard from '@pages/AdminDashboard/AdminDashboard';
// import BlogPage from '@pages/Blog/BlogPage'; // Example additional page
import '@styles/reset.css';

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <Navbar onLoginClick={() => setShowLogin(true)} />
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/tai-khoan" element={<UserAccount />} />
          {/* <Route path="/tin-tuc" element={<BlogPage />} /> */}
          {/* <Route path="*" element={<NotFoundPage />} />  404 page */}
          <Route path="/admin" element={<AdminDashboard />} />
          {/* Add more routes as needed */}
        </Routes>
        
        <Login 
          visible={showLogin} 
          onCancel={() => setShowLogin(false)}
          onLoginSuccess={() => {
            setShowLogin(false);
            // Handle successful login (e.g., redirect or update state)
          }}
        />
      </div>
      <div class= "test">
        {/* <Navbar />
        <LandingPage /> */}
        <UserAccount />
        {/* <Login />
        <AdminDashboard /> */}
      </div>
    </Router>
  );
}

export default App;