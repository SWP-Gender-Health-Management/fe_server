import React, { createContext, useContext, useState } from 'react'; // Thêm useContext

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('account_id'));
  const [userInfo, setUserInfo] = useState({
    accountId: sessionStorage.getItem('account_id') || null,
    fullname: sessionStorage.getItem('fullname') || null,
  });

  const login = (accessToken, refreshToken, accountId, fullname) => {
    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('accountId', accountId || null);
    sessionStorage.setItem('fullname', fullname || 'Người dùng');
    setIsLoggedIn(true);
    setUserInfo({ accountId, fullname: fullname || 'Người dùng' }); // Cập nhật userInfo
  };

  const logout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('account_id');
    sessionStorage.removeItem('fullname');
    setIsLoggedIn(false);
    setUserInfo({ accountId: null, fullname: null });
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfo, login, logout, setUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);