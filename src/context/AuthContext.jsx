import { useState, useEffect, createContext } from 'react';
import { supabase } from '../supabase/client';
import { alert } from '../utils/alert';
import { ALERT_TYPE } from '../constants/alertConstant';

const AuthContext = createContext(null);

export const AuthProVider = ({ children }) => {
  const { ERROR } = ALERT_TYPE;
  const errorAlert = alert();

  const [isLogin, setIsLogin] = useState(false);

  //일단 로그인을 위해 id비밀번호 문자열로 넣어두겠습니다!
  //닉네임 장현빈(님) 과 연결되어 있는 id비밀번호입니다.
  const [supabaseRequestId, setSupabaseRequestId] = useState('pal@naver.com');
  const [supabaseRequestPassword, setSupabaseRequestPassword] =
    useState('1234');

  useEffect(() => {
    const signUp = async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: supabaseRequestId,
        password: supabaseRequestPassword,
      });
      if (error) errorAlert({ type: ERROR, content: error.message });
      setIsLogin(data);
    };
    signUp();
  }, []);
  //여기 부분은 로그인 페이지에 있는게 맞는 것 같긴합니다 일단 로그인 로직을 위해 여기에 작성합니다~~

  return (
    <AuthContext.Provider value={{ isLogin }}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
