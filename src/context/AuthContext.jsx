// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('accountId'));
  const [userInfo, setUserInfo] = useState({
    accountId: Cookies.get('accountId') || null,
    fullname: Cookies.get('fullname') || null,
    role: Cookies.get('role') || null,
  });

  // Cập nhật trạng thái khi cookie thay đổi
  useEffect(() => {
    const interval = setInterval(() => {
      const accountId = Cookies.get('accountId');
      const fullname = Cookies.get('fullname');
      const role = Cookies.get('role');
      setIsLoggedIn(!!accountId);
      setUserInfo({
        accountId: accountId || null,
        fullname: fullname || null,
        role: role || null,
      });
    }, 1000); // kiểm tra mỗi giây

    return () => clearInterval(interval);
  }, []);

  const login = (accessToken, refreshToken, accountId, fullname, role) => {
    Cookies.set('accessToken', accessToken, { expires: 1 });
    Cookies.set('accountId', accountId || null, { expires: 1 });
    Cookies.set('fullname', fullname || 'Người dùng', { expires: 1 });
    Cookies.set('role', role || null, { expires: 1 });
    setIsLoggedIn(true);
    setUserInfo({ accountId, fullname: fullname || 'Người dùng', role });
  };

  const onLogout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('accountId');
    Cookies.remove('fullname');
    Cookies.remove('role');
    setIsLoggedIn(false);
    setUserInfo({ accountId: null, fullname: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfo, login, onLogout, setUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
