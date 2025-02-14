import styled from 'styled-components';
import { Link, Outlet, useLocation } from 'react-router-dom';

//마이페이지
const MyPage = () => {
  //현재있는 페이지를 기준으로 폰트두깨가 변경됩니다
  const currentLocation = useLocation().pathname.slice(8);
  let editFontWeight = 200;
  let myPostsFontWeight = 200;
  let joinPostFontWeight = 200;
  if (currentLocation === 'edit-profile') editFontWeight = 1000;
  if (currentLocation === 'my-posts') myPostsFontWeight = 1000;
  if (currentLocation === 'joined-posts') joinPostFontWeight = 1000;

  return (
    <StMypage>
      <div>
        <div className='sidebar'>
          <ul>
            <li>
              <Link
                to='/mypage/edit-profile'
                style={{ fontWeight: editFontWeight }}
              >
                프로필수정
              </Link>
            </li>
            <li>
              <Link
                to='/mypage/my-posts'
                style={{ fontWeight: myPostsFontWeight }}
              >
                내가쓴게시물
              </Link>
            </li>
            <li>
              <Link
                to='/mypage/joined-posts'
                style={{ fontWeight: joinPostFontWeight }}
              >
                참여한게시물
              </Link>
            </li>
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
  a {
    text-decoration: none;
    color: inherit;
    outline: none;
    cursor: pointer;
  }
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
