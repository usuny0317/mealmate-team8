import { Link } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';

export const Layout = ({ children }) => {
  const {
    colors: { primaryLight },
  } = useTheme();
  return (
    <>
      <StLayout $primaryLight={primaryLight}>
        <header>
          <div className='header-home-area'>
            <Link to='/'>
              <img src='/mm_logo.svg' />
            </Link>
            <Link to='/'>
              <div className='header-title'>MealMate</div>
            </Link>
          </div>
          <div className='header-mypage-area'>
            {/* 유저정보에따라 login mypage이동 */}
            <Link to='/mypage'>
              <div>마이페이지,로그인창 이동영역</div>
            </Link>
          </div>
        </header>
      </StLayout>
      <div style={{ paddingTop: '60px' }}>{children}</div>
    </>
  );
};

const StLayout = styled.div`
  background-color: ${(props) => props.$primaryLight};
  position: fixed;
  top: 0;
  left: 0;
  height: 60px;
  width: 100%;
  z-index: 1000;
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
    width: 60px;
  }
  .header-title {
    padding: 13px 5px;
    font-size: 30px;
  }
  .header-mypage-area {
    background-color: green;
    height: 60px;
  }
`;
