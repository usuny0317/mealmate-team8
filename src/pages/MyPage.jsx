import styled from 'styled-components';
import { Link, Outlet } from 'react-router-dom';

//마이페이지
const MyPage = () => {
  return (
    <StMypage>
      <div>
        <div className='sidebar'>
          <ul>
            <Link to='/mypage/edit-profile'>
              <li>프로필수정</li>
            </Link>
            <Link to='/mypage/my-posts'>
              <li>내가쓴게시물</li>
            </Link>
            <Link to='/mypage/joined-posts'>
              <li>참여한게시물</li>
            </Link>
          </ul>
        </div>
      </div>
      <div>
        <div>
          <Outlet />
        </div>
      </div>
    </StMypage>
  );
};

//https://mini-frontend.tistory.com/4

const StMypage = styled.div`
  display: flex;
  .sidebar {
    margin: 10% 0;
    position: sticky;
    width: 20vw;
    min-width: 180px;
    max-width: 300px;
    height: 80vh;
    border-right: 3px solid gray;
    color: black;
    padding: 20px;
    display: flex;
    flex-direction: column;
    transition: width 0.3s ease-in-out;
  }
  .sidebar ul {
    list-style: none;
    padding: 0;
  }
  .sidebar li {
    padding: 10px 0;
    cursor: pointer;
  }
  .sidebar li:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  @media (max-width: 600px) {
    .sidebar {
      width: 30vw;
      min-width: 140px;
    }
  }
`;

export default MyPage;
