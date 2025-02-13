import { Link } from 'react-router-dom';
import styled from 'styled-components';

//supabase에 연결하는 걸 진행할 생각입니다!
//회원가입이 더 빨리 진행되어야할 것 같아서 잠시 비워두겠습니다!
//함수 이름도 나중에 진행하며 변경하겠습니다!
const a = () => {};

//로그인 페이지지
const LogIn = () => {
  return (
    <Wrapper>
      <div className='all'>
        <div className='left'>
          <form className='login-form' onSubmit={a} id='senduser'>
            <label>
              Email: <input type='email' placeholder='이메일 입력' />
            </label>
            <label>
              Password: <input type='password' placeholder='비밀번호 입력' />
            </label>
            <button>로그인하기</button>
            <br />
            <Link to='/signup'> 회원가입하기 </Link>
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

//이 아래는 스타일 컴포넌트 입니다. St~ 형식으로 작성하였고, 편하게 피드백 주세요!
//아직 전체적인 색과 버튼 그리고 로고를 넣지 않아 형태만 있습니다!

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
    font-size: 30px;
  }
`;
