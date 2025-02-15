import { useState, useEffect, createContext } from 'react';
import { supabase } from '../supabase/client';
import { alert } from '../utils/alert';
import { ALERT_TYPE } from '../constants/alertConstant';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { ERROR } = ALERT_TYPE;
  const errorAlert = alert();

  const [isLogin, setIsLogin] = useState(false);
  const [loggedInUser, setAuthUserId] = useState('anon');

  //일단 로그인을 위해 id비밀번호 문자열로 넣어두겠습니다!
  //닉네임 장현빈(님) 과 연결되어 있는 id비밀번호입니다.
  const [userEmail, setUserEmail] = useState('pal@naver.com');
  const [userPassword, setUserPassword] = useState('1234');

  useEffect(() => {
    let authUserId = '';
    const getUserInfo = async () => {
      const {
        data: { user },
        errorSignUp,
      } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: userPassword,
      });
      if (errorSignUp) {
        errorAlert({ type: ERROR, content: '로그인실패 아이디 비밀번호 다름' });
        return;
      }
      setIsLogin(!!user);
      authUserId = user.id;
      //받아온 auth_Id로 해당유저의 public 유저 정보 가져옴
      const { data, errorFetchUserData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUserId)
        .single();
      if (errorFetchUserData) {
        errorAlert({ type: ERROR, content: '서버에러' });
      }
      setAuthUserId(data);
    };
    getUserInfo();
  }, []);
  //여기 부분은 로그인 페이지에 있는게 맞는 것 같긴합니다 일단 로그인을 위해 여기에 작성합니다~~

  return (
    <AuthContext.Provider
      value={{ isLogin, setIsLogin, loggedInUser, setUserEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
