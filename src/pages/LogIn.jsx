import { Link } from 'react-router-dom';
import styled from 'styled-components';

const a = () => {};

//로그인 페이지지
const LogIn = () => {
  return (
    <StLoginDiv>
      <StRightDiv>
        <STform onSubmit={a} id='senduser'>
          <label>
            Email: <input type='email' placeholder='이메일 입력' />
          </label>
          <label>
            Password: <input type='password' placeholder='비밀번호 입력' />
          </label>
          <button>로그인하기</button>
          <br />
          <Link to='/signup'> 회원가입하기 </Link>
        </STform>
      </StRightDiv>

      <StLeftDiv>
        <StImgbox>로고 이미지</StImgbox>
      </StLeftDiv>
    </StLoginDiv>
  );
};

export default LogIn;

const StLoginDiv = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

const StLeftDiv = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid #00aaff;
`;

const StRightDiv = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid #ffaad4;
`;
const STform = styled.form`
  padding: 20px;
  border: 2px solid black;
  display: flex;
  flex-direction: column;
  font-size: 30px;
`;

const StImgbox = styled.div`
  font-size: 32px;
  font-weight: bold;
`;
