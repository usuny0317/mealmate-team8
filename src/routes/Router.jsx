import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import LogIn from '../pages/LogIn';
import SignUp from '../pages/SignUp';
import MyPage from '../pages/MyPage';

import PostEditor from '../pages/PostEditor';
import { Layout } from '../components/common/Layout';
import { EditProfile } from '../components/mypage/EditProfile';
import { MyPosts } from '../components/mypage/MyPosts';
import { JoinedPosts } from '../components/mypage/JoinedPosts';

const Router = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LogIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/mypage' element={<MyPage />}>
            <Route path='/mypage/edit-profile' element={<EditProfile />} />
            <Route path='/mypage/my-posts' element={<MyPosts />} />
            <Route path='/mypage/joined-posts' element={<JoinedPosts />} />
          </Route>

          <Route path='/posteditior' element={<PostEditor />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default Router;
