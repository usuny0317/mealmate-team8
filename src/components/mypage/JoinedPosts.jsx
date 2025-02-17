import { useContext, useEffect, useState } from 'react';
import { alert } from '../../utils/alert';
import { ALERT_TYPE } from '../../constants/alertConstant';
import AuthContext from '../../context/AuthContext';
import { supabase } from '../../supabase/client';
import styled from 'styled-components';
import PostCard from '../home/PostCard';
import Empty from '../common/Empty';

export const JoinedPosts = () => {
  //포스터를 저정하는 state
  const [posts, setPosts] = useState([]);
  const { loggedInUser } = useContext(AuthContext);

  //sweet alert
  const { ERROR } = ALERT_TYPE;
  const errorAlert = alert();

  useEffect(() => {
    const getPostsByUserNickName = async () => {
      //받아온 닉네임을 기준으로 포스트리스트에서  가져오기
      const { data, errorGetPosts } = await supabase
        .from('actions')
        .select('posts(*, users!inner(profile),actions(*))')
        .eq('user_id', loggedInUser.id);

      //받아온 데이터를 카드 컴포넌트에 맞게 가공
      const postDataList = data.map((post) => {
        return post.posts;
      });
      setPosts(postDataList);

      if (errorGetPosts)
        errorAlert({ type: ERROR, content: errorGetPosts.message });
    };

    getPostsByUserNickName();
  }, []);

  return (
    <StMyPostsWrapper>
      {posts ? (
        <div className='postCards'>
          {posts.map((data) => (
            <PostCard key={`post_${data.id}`} postData={data} />
          ))}
        </div>
      ) : (
        <div>참여한 게시물이 없습니다</div>
      )}
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
