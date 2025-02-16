import styled from 'styled-components';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { ALERT_TYPE } from '../constants/alertConstant';
import { alert } from '../utils/alert';

//마이페이지
const MyPage = () => {
  //현재있는 페이지를 기준으로 폰트두깨가 변경됩니다
  const { isLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const currentLocation = useLocation().pathname.slice(8);

  //sweet alert
  const { ERROR } = ALERT_TYPE;
  const errorAlert = alert();

  //로그인이 안되어 있으면 로그인 페이지로 이동
  if (!isLogin) {
    errorAlert({
      type: ERROR,
      content: '로그인이 필요합니다. 로그인 페이지로 이동합니다.',
    }).then((res) => {
      if (res.isConfirmed) navigate('/login', { replace: true });
    });
    return <></>;
  }

  return (
    <StMypage>
      <div>
        <div className='sidebar'>
          <ul>
            <li>
              <Link
                className={currentLocation === 'edit-profile' ? 'active' : ''}
                to='/mypage/edit-profile'
              >
                프로필수정
              </Link>
            </li>
            <li>
              <Link
                className={currentLocation === 'my-posts' ? 'active' : ''}
                to='/mypage/my-posts'
              >
                내가쓴게시물
              </Link>
            </li>
            <li>
              <Link
                className={currentLocation === 'joined-posts' ? 'active' : ''}
                to='/mypage/joined-posts'
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

const StMypage = styled.div`
  .active {
    font-weight: 1000;
  }
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
