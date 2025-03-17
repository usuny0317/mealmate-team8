import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../supabase/client';
import AuthContext from '../context/AuthContext';

import { alert } from '../utils/alert';
import { ALERT_TYPE } from '../constants/alertConstant';

const LogIn = () => {
  // Alert usage
  const { ERROR } = ALERT_TYPE;
  const errorAlert = alert();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Auth context
  const { setLoggedInUser } = useContext(AuthContext);

  const navigate = useNavigate();

  // Login handler
  const loginhandler = async (e) => {
    e.preventDefault();

    let authUserId = '';
    try {
      // Login attempt
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      // Handle login failures
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

      // Get user ID
      authUserId = data.user.id;

      // Get user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUserId)
        .single();

      if (userData === null) {
        errorAlert({ type: ERROR, content: '로그인요청오류' });
        return;
      }

      if (userError) {
        errorAlert({ type: ERROR, content: '서버 에러!!' });
        return;
      }

      // Login successful
      sessionStorage.setItem('loggedInUser', JSON.stringify(userData));
      setLoggedInUser(userData);
      navigate('/', { replace: true });
      window.history.pushState(null, '', '/');
      window.history.replaceState(null, '', '/');
    } catch (err) {
      errorAlert({ type: ERROR, content: '에러남!' + err });
    }
  };

  return (
    <StWrapper>
      <div className='content-container'>
        <div className='login-container'>
          <form className='login-form' id='send-user' onSubmit={loginhandler}>
            <div className='logo-container'>
              <img src='/mm_logo.svg' alt='Logo' />
              <h2 className='login-title'>로그인</h2>
            </div>

            <div className='form-group'>
              <label htmlFor='email'>이메일</label>
              <input
                id='email'
                type='email'
                placeholder='이메일 입력'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='password'>비밀번호</label>
              <input
                id='password'
                type='password'
                placeholder='비밀번호 입력'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className='button-group'>
              <button type='submit' className='login-btn'>
                로그인하기
              </button>
              <button
                type='button'
                className='signup-btn'
                onClick={() => navigate('/signup')}
              >
                회원가입하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </StWrapper>
  );
};

export default LogIn;

const StWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  margin: auto 20px auto 20px;

  .content-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-container {
    width: 100%;
    max-width: 450px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .login-form {
    width: 100%;
    background-color: #fff;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .logo-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
  }

  img {
    width: 100px;
    height: 100px;
  }

  .login-title {
    margin-top: 15px;
    font-size: 24px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primaryLight};
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  label {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }

  input {
    padding: 12px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: border-color 0.3s;
  }

  input:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primaryLight};
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
  }

  .button-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 10px;
  }

  button {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .login-btn {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: white;
  }

  .login-btn:hover {
    opacity: 0.9;
  }

  .signup-btn {
    background-color: #e7e7e7;
    color: #333;
  }

  .signup-btn:hover {
    background-color: #d9d9d9;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .login-form {
      padding: 30px;
    }
  }

  @media (max-width: 480px) {
    .login-form {
      padding: 20px;
      box-shadow: none;
      border: 1px solid #ddd;
    }

    img {
      width: 80px;
      height: 80px;
    }

    .login-title {
      font-size: 20px;
    }

    input {
      padding: 10px;
    }

    button {
      padding: 10px;
    }
  }
`;
