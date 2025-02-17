import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { setLoggedInUser } = useContext(AuthContext);

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
        sessionStorage.setItem('loggedInUser', JSON.stringify(data));

        //로그인상태가 바뀌면 컨텍스트 다시 렌더링

        setLoggedInUser(data);
        navigate('/', { replace: true });
        window.history.pushState(null, '', '/');
        window.history.replaceState(null, '', '/');
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
            <div className='title'>
              <img src='/mm_logo.svg' />
              <div className='text'>로그인</div>
            </div>

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
            <button
              type='button'
              onClick={() => {
                navigate('/signup');
              }}
            >
              회원가입하기
            </button>
          </form>
        </div>
      </div>
    </StWrapper>
  );
};

export default LogIn;

//이 아래는 스타일 컴포넌트 입니다.
const StWrapper = styled.div`
  .all-page {
    display: flex;
    width: 100vw;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.colors.primaryLight};
  }

  .left-side {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  img {
    width: 100px;
    height: 100px;
    margin-top: 50px;
  }

  .title {
    display: flex;
    flex-direction: column;
    align-items: center;
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
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: white;
    border-radius: 3px;
    font-weight: bold;
    border: none;
    padding: 10px 0;
  }

  .input-group {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    width: 100%;
  }

  .input-group label {
    width: 100%;
    text-align: right;
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
  .text {
    margin-top: 10px;
  }
`;
