import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import LogIn from '../pages/LogIn';
import SignUp from '../pages/SignUp';
import MyPage from '../pages/MyPage';
import Detail from '../pages/Detail';
import PostEditor from '../pages/PostEditor';
import { Header } from '../components/common/Header';
import styled from 'styled-components';

const Router = () => {
  return (
    <BrowserRouter>
      <Header />
      <StRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LogIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/mypage' element={<MyPage />} />
          <Route path='/detail' element={<Detail />} />
          <Route path='/posteditior' element={<PostEditor />} />
        </Routes>
      </StRouter>
    </BrowserRouter>
  );
};

//Header네비바 영역에 안 덮혀지기 작성해놓은 스타일입니다.
const StRouter = styled.div`
  padding-top: 60px;
`;

export default Router;
