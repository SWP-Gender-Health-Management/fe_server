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

  // Lắng nghe sự kiện từ các tab khác để sync login/logout
  useEffect(() => {
    const handleStorageChange = () => {
      const accountId = Cookies.get('accountId');
      const fullname = Cookies.get('fullname');
      const role = Cookies.get('role');

      setIsLoggedIn(!!accountId);
      setUserInfo({
        accountId: accountId || null,
        fullname: fullname || null,
        role: role || null,
      });
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Hàm login - được gọi sau khi đăng nhập thành công
const login = (accessToken,refreshToken, accountId, fullname, role) => {
  Cookies.set('accessToken', accessToken, { expires: 1 }); // Lưu lại duy nhất refreshToken
  Cookies.set('refreshToken', refreshToken, { expires: 1 }); // Lưu lại duy nhất refreshToken
  Cookies.set('accountId', accountId, { expires: 7 });
  Cookies.set('fullname', fullname || 'Người dùng', { expires: 7 });
  Cookies.set('role', role || '', { expires: 7 });

  localStorage.setItem('auth-update', Date.now());

  setIsLoggedIn(true);
  setUserInfo({ accountId, fullname: fullname || 'Người dùng', role });
};


  // Hàm logout toàn bộ
  const onLogout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('accountId');
    Cookies.remove('fullname');
    Cookies.remove('role');

    // Trigger cập nhật các tab khác
    localStorage.setItem('auth-update', Date.now());

    setIsLoggedIn(false);
    setUserInfo({ accountId: null, fullname: null, role: null });
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userInfo, login, onLogout, setUserInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
