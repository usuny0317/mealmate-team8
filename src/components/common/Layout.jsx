import { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import AuthContext from '../../context/AuthContext';

export const Layout = ({ children }) => {
  // const { isLogin } = useContext(AuthContext);
  const isLogin = true;
  const {
    colors: { primaryLight },
  } = useTheme();

  return (
    <>
      <StLayout $primaryLight={primaryLight}>
        <header>
          <div className='header-home-area'>
            <Link to='/'>
              <img src='/mm_white_logo.webp' />
            </Link>
            <Link to='/'>
              <div className='header-title'>MealMate</div>
            </Link>
          </div>
          <div className='header-mypage-area'>
            {/* 유저정보에따라 login mypage이동 */}
            {isLogin ? (
              <>
                <div className='header-mypage-context'>로그아웃</div>
                <Link to='/mypage/my-posts'>
                  <img
                    className='profile'
                    src='https://contents.creators.mypetlife.co.kr/content/uploads/2020/03/20175706/202003202Faf7a5a92a45c71f76391883a3e3ac572.jpg'
                    alt='user_profile'
                  />
                </Link>
              </>
            ) : (
              <>
                <Link to='/login'>
                  <div className='header-mypage-context'>로그인 하기</div>
                </Link>
                <Link to='/signup'>
                  <div className='header-mypage-context'>회원가입 하기</div>
                </Link>
              </>
            )}
          </div>
        </header>
      </StLayout>
      <div style={{ paddingTop: '100px' }}>{children}</div>
    </>
  );
};

const StLayout = styled.div`
  background-color: ${(props) => props.$primaryLight};
  position: fixed;
  top: 0;
  left: 0;
  height: 100px;
  width: 100%;
  z-index: 1000;
  .header-mypage-area {
    width: 230px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 100px;
  }
  .header-mypage-context {
    border-radius: 7px;
    padding: 8px;
    font-size: 14px;
    color: white;
    font-weight: 500;
    cursor: pointer;
    transition: 0.3s;
  }
  .header-mypage-context:hover {
    font-size: 17px;
  }
  .profile {
    width: 60px;
    border-radius: 50%;
    cursor: pointer;
    transition: 0.3s;
  }
  .profile:hover {
    width: 70px;
  }
  a {
    text-decoration: none;
    color: inherit;
    outline: none;
    cursor: pointer;
  }
  header {
    display: flex;
    justify-content: space-between;
  }
  .header-home-area {
    display: flex;
  }
  .header-home-area img {
    margin-top: 20px;
    margin-left: 20px;
    width: 60px;
  }
  .header-title {
    color: white;
    padding: 35px 15px;
    font-size: 35px;
  }
`;
