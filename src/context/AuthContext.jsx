import { useState, createContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  //로그인상태(isLogin)와 로그인한유저(loggedInUser)는 세션에서 받아옵니다.
  //isLogin 세션스토리에 값이 있으면 true 없으면 false가 됩니다.

  const [loggedInUser, setLoggedInUser] = useState(
    JSON.parse(sessionStorage.getItem('loggedInUser'))
  );

  const isLogin = !!loggedInUser;
  return (
    <AuthContext.Provider value={{ isLogin, setLoggedInUser, loggedInUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
