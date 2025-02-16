import { useState, useEffect, createContext, useRef } from 'react';
import { supabase } from '../supabase/client';
import { alert } from '../utils/alert';
import { ALERT_TYPE } from '../constants/alertConstant';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { ERROR } = ALERT_TYPE;
  const errorAlert = alert();

  //로그인상태(isLogin)와 로그인한유저(loggedInUser)는 세션에서 받아옵니다.
  //isLogin 세션스토리에 값이 있으면 true 없으면 false가 됩니다.
  const [isLogin, setIsLogin] = useState(!!sessionStorage.getItem('isLogin'));
  const loggedInUser =
    JSON.parse(sessionStorage.getItem('loggedInUser')) || 'anon';

  //일단 로그인을 위해 id비밀번호 문자열로 넣어두겠습니다!
  //닉네임 장현빈(님) 과 연결되어 있는 id비밀번호입니다.
  const [userEmail, setUserEmail] = useState('pal@naver.com');
  const [userPassword, setUserPassword] = useState('1234');
  useEffect(() => {
    let authUserId = '';
    const getUserInfo = async () => {
      const {
        data: { user },
      } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: userPassword,
      });
      if (user === null) {
        errorAlert({
          type: ERROR,
          content: '로그인 실패 :: 아이디 비밀번호를 확인하세요',
        });
        return;
      }

      authUserId = user.id;
      //받아온 auth_Id로 해당유저의 public 유저 정보 가져옴
      const { data, errorFetchUserData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUserId)
        .single();
      if (data === null) {
        errorAlert({ type: ERROR, content: '로그인요청오류' });
        return;
      }

      //isLogin은 세션스토리지에 값이 존재하면 true가 됩니다.
      sessionStorage.setItem('isLogin', '로그인완료됨');
      sessionStorage.setItem('loggedInUser', JSON.stringify(data));

      //로그인상태가 바뀌면 컨텍스트 다시 렌더링
      setIsLogin(!!user);
    };

    getUserInfo();
  }, []);
  //useEffact 부분 잘라내고 폼 제출시 발생하는 이벤트 핸들러에 넣으면 될 거 같아요

  return (
    <AuthContext.Provider value={{ isLogin, loggedInUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
