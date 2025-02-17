import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../supabase/client';
import AuthContext from '../context/AuthContext';

import { alert } from '../utils/alert';
import { ALERT_TYPE } from '../constants/alertConstant';
import { theme } from '../styles/theme';

//로그인 페이지지
const LogIn = () => {
  //alert 사용하기기
  const { ERROR } = ALERT_TYPE;
  const errorAlert = alert();

  //이메일 비밀번호 받아오기
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //구조분해할당으로 context를 받아옵니다.
  const { setIsLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  //로그인 시도 및 사용자 정보를 context로 보냅니다.
  const loginhandler = async (e) => {
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
        if (data.user === null) {
          errorAlert({
            type: ERROR,
            content: '로그인실패 :: 아이디 비밀번호를 확인해주세요!',
          });
          return;
        }
        if (error) {
          errorAlert({
            type: ERROR,
            content: 'err' + error,
          });
          return;
        }

        //user의 id 값 << console로 제대로 들어가는 것 확인함!
        authUserId = data.user.id;
      }
      //data / error 형태로 쓰지 않으면 자꾸만 오류가 나서 {}로 범위를 나눠버렸습니다!
      //받아온 값으로 유저 정보 가져옵니다.
      {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUserId)
          .single();

        if (data === null) {
          errorAlert({ type: ERROR, content: '로그인요청오류' });
          return;
        }
        //오류날 시
        if (error) {
          errorAlert({ type: ERROR, content: '서버 에러!!' });
          return;
        }

        //성공할 시
        sessionStorage.setItem('isLogin', '로그인완료됨');
        sessionStorage.setItem('loggedInUser', JSON.stringify(data));

        //로그인상태가 바뀌면 컨텍스트 다시 렌더링
        setIsLogin(true);
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
          <form className='login-form' id='send-user' onSubmit={loginhandler}>
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
            <button type='button'>
              <Link to='/signup' className='sign-up'>
                회원가입하기
              </Link>
            </button>
          </form>
        </div>

        <div className='right-side'>
          <div className='img-box'>
            <img src='/mm_white_logo.webp' />
          </div>
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
    overflow: hidden;
    color: ${({ theme }) => theme.colors.primary};
  }
  .right-side {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.primary};
  }
  .left-side {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .img-box {
    width: 100%;
    height: 100%;
  }
  .img-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .login-form {
    padding: 20px;
    display: flex;
    flex-direction: column;
    font-size: 18px;
    gap: 16px;
    width: 60%;
  }
  .login-form button {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    border-radius: 3px;
    font-weight: bold;
  }

  .input-group {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    width: 100%;
  }

  .input-group label {
    width: 100%; /* label 고정 너비 */
    text-align: right; /* 오른쪽 정렬 */
  }

  .input-group input {
    flex: 1;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: calc(100% - 110px); /* input이 남은 공간 채우기 */
    box-sizing: border-box;
    margin-left: 10px;
  }

  .sign-up {
    text-decoration-line: none;
    color: white;
    font-weight: bold;
  }
`;
