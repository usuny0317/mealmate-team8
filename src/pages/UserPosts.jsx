import React, { useContext, useEffect, useState } from 'react';
import PostCard from '../components/home/PostCard';
import { supabase } from '../supabase/client';
import { alert } from '../utils/alert';
import { ALERT_TYPE } from '../constants/alertConstant';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import AuthContext from '../context/AuthContext';

const UserPosts = () => {
  const { isLogin, loggedInUser } = useContext(AuthContext);
  //받아온 포스트를 저장하는 state
  const [posts, setPosts] = useState([]);

  //패치파라미터로 유저닉네임 가져오기
  const { userNickname } = useParams();
  const navigate = useNavigate();

  //sweet Alert
  const errorAlert = alert();
  const { ERROR } = ALERT_TYPE;

  useEffect(() => {
    //받아온 닉네임을 기준으로 포스트리스트에서  가져오기
    const getPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('author_name', userNickname);
      setPosts(data);

      if (error) errorAlert({ type: ERROR, content: error.message });
    };
    if (isLogin) getPosts();
  }, []);

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

  //로그인한 유저가 자신의 프로필을 클릭했을시
  if (loggedInUser.nick_name === userNickname) {
    navigate('/mypage/my-posts', { replace: true });
    return <></>;
  }

  return (
    <StUserPostsWrapper>
      <div className='postCards'>
        {posts.map((data) => (
          <PostCard key={`post_${data.id}`} postData={data} />
        ))}
      </div>
    </StUserPostsWrapper>
  );
};

const StUserPostsWrapper = styled.div`
  padding-top: 20px;
  .postCards {
    width: 100%;
    display: flex;
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }
`;

export default UserPosts;
