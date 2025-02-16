import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../supabase/client';
import AuthContext from '../context/AuthContext';

import { alert } from '../utils/alert';
import { ALERT_TYPE } from '../constants/alertConstant';

//로그인 페이지지
const LogIn = () => {
  //alert 사용하기기
  const { ERROR } = ALERT_TYPE;
  const errorAlert = alert();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //구조분해할당으로 context를 받아옵니다.
  const { isLogin, setIsLogin, loggedInUser, setAuthUserId } =
    useContext(AuthContext);

  const navigate = useNavigate();
  //로그인 시도 및 사용자 정보를 context로 보냅니다.
  const Login = async (e) => {
    e.preventDefault();

    let authUserId = '';
    //로그인 시도
    try {
      {
        //data/error 형태로 하지 않으면 오류나서 범위 나눴습니다.
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        //로그인 실패 시, alert
        if (error) {
          errorAlert({
            type: ERROR,
            content: '로그인실패 아이디 비밀번호 다름',
          });
          return;
        }
        //성공 시 로그인 상태를 true로 바꿔 줍니다.
        setIsLogin(true);

        //user의 id 값 << console로 제대로 들어가는 것 확인함!
        authUserId = data.user.id;
      }
      //data / error 형태로 쓰지 않으면 자꾸만 오류가 나서
      // {}로 범위를 나눠버렸습니다!
      //받아온 값으로 유저 정보 가져옵니다.
      {
        const { data, error } = await supabase //여기서 오류나
          .from('users')
          .select('*')
          .eq('id', authUserId)
          .limit(1)
          .maybeSingle();

        //오류날 시
        if (error) {
          errorAlert({ type: ERROR, content: '서버 에러!!' });
        }
        //성공할 시
        setAuthUserId(data);
        navigate('/');
      }
    } catch (err) {
      errorAlert({ type: ERROR, content: '에러남!' + err });
    }
  };

  return (
    <StWrapper>
      <div className='all-page'>
        <div className='left-side'>
          <form className='login-form' id='send-user' onSubmit={Login}>
            <div className='input-group'>
              <label>
                Email:
                <input
                  type='email'
                  placeholder='이메일 입력'
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </label>
            </div>
            <div className='input-group'>
              <label>
                Password:
                <input
                  type='password'
                  placeholder='비밀번호 입력'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </label>
            </div>
            <button type='submit'>로그인하기</button>
            <button>
              <Link to='/signup' className='sign-up'>
                회원가입하기
              </Link>
            </button>
          </form>
        </div>

        <div className='right-side'>
          <div className='img-box'>로고 이미지</div>
        </div>
      </div>
    </StWrapper>
  );
};

export default LogIn;

//이 아래는 스타일 컴포넌트 입니다.
//아직 전체적인 색과 버튼 그리고 로고를 넣지 않아 형태만 있습니다!
//wrapper로 감쌌습니다!
const StWrapper = styled.div`
  .all-page {
    display: flex;
    width: 100vw;
    height: 100vh;
  }
  .right-side {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 3px solid #ffaad4;
  }
  .left-side {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 3px solid #00aaff;
  }

  .img-box {
    font-size: 32px;
    font-weight: bold;
  }

  .login-form {
    padding: 20px;
    border: 2px solid black;
    display: flex;
    flex-direction: column;
    font-size: 18px;
    gap: 16px;
  }
  .input-group input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .input-group {
    display: flex;
    flex-direction: column;
    font-size: 20px;
  }

  .sign-up {
    text-decoration-line: none;
  }
`;
