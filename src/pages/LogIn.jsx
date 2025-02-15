import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../supabase/client';

//로그인 페이지지
const LogIn = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const navigate = useNavigate();

  const Login = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: userPassword,
      });

      if (error) throw error;
      console.log('성공! 유저 데이터:', data);
      navigate('/');
    } catch (err) {
      console.error('실패:', err.message);
    }
  };

  return (
    <Wrapper>
      <div className='all'>
        <div className='left'>
          <form className='login-form' id='send-user' onSubmit={Login}>
            <div className='input-group'>
              <label>
                Email:
                <input
                  type='email'
                  placeholder='이메일 입력'
                  value={userEmail}
                  onChange={(e) => {
                    setUserEmail(e.target.value);
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
                  value={userPassword}
                  onChange={(e) => {
                    setUserPassword(e.target.value);
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

        <div className='right'>
          <div className='img-box'>로고 이미지</div>
        </div>
      </div>
    </Wrapper>
  );
};

export default LogIn;

//이 아래는 스타일 컴포넌트 입니다.
//아직 전체적인 색과 버튼 그리고 로고를 넣지 않아 형태만 있습니다!
//wrapper로 감쌌습니다!
const Wrapper = styled.div`
  .all {
    display: flex;
    width: 100vw;
    height: 100vh;
  }
  .right {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 3px solid #ffaad4;
  }
  .left {
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
