import { useContext, useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import { ALERT_TYPE } from '../../constants/alertConstant';
import PostCard from '../home/PostCard';
import { alert } from '../../utils/alert';
import AuthContext from '../../context/AuthContext';
import styled from 'styled-components';
//유저 아이디를 기준으로 닉네임을 검색
//닉네임을 기준으로 데이터 띄우기

export const MyPosts = () => {
  //포스터를 저정하는 state
  const [posts, setPosts] = useState([]);
  const { loggedInUser } = useContext(AuthContext);

  //sweet alert
  const { ERROR } = ALERT_TYPE;
  const errorAlert = alert();

  useEffect(() => {
    const getPostsByUserNickName = async () => {
      //전역에설정되어있는 auth의 uid로 닉네임을 불러오는 요청

      //받아온 닉네임을 기준으로 포스트리스트에서  가져오기
      const { data, errorGetPosts } = await supabase
        .from('posts')
        .select('*, users!inner(profile)')
        .eq('author_name', loggedInUser.nick_name);
      setPosts(data);
      if (errorGetPosts)
        errorAlert({ type: ERROR, content: errorGetPosts.message });
    };

    getPostsByUserNickName();
  }, []);

  return (
    <StMyPostsWrapper>
      <div className='postCards'>
        {posts.map((data) => (
          <PostCard key={`post_${data.id}`} postData={data} />
        ))}
      </div>
    </StMyPostsWrapper>
  );
};

const StMyPostsWrapper = styled.div`
  margin-top: 30px;
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
