import styled from 'styled-components';
import SearchField from '../components/home/SearchField';
import PostCard from '../components/home/PostCard';
import { useEffect, useState } from 'react';
import Empty from '../components/common/Empty';
import { ALERT_TYPE } from '../constants/alertConstant';
import { supabase } from '../supabase/client';
import { alert } from '../utils/alert';
const { ERROR } = ALERT_TYPE;
//메인 페이지
const Home = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const errorAlert = alert();
    const getPosts = async () => {
      const { data, error } = await supabase.from('posts').select('*');
      if (error) {
        errorAlert({ type: ERROR, content: '오류가 발생했습니다.' });
        throw error;
      }
      setPosts(data);
    };

    getPosts();
  }, []);
  return (
    <StHomeWrapper>
      <article id='home'>
        <SearchField />
        {posts.length === 0 ? (
          <Empty />
        ) : (
          <div className='postCards'>
            {posts.map((data) => (
              <PostCard key={`post_${data.id}`} postData={data} />
            ))}
          </div>
        )}
      </article>
    </StHomeWrapper>
  );
};

export default Home;
const StHomeWrapper = styled.div`
  #home {
    padding-top: 10vh;
    width: 80vw;
    margin: 0 auto;
    min-width: 300px;
    max-width: 1440px;
  }
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
