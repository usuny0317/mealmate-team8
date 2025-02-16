import { useState, createContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [loggedInUser, setAuthUserId] = useState('anon');

  return (
    <AuthContext.Provider
      value={{ isLogin, setIsLogin, loggedInUser, setAuthUserId }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
