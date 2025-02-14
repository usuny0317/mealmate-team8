import styled from 'styled-components';
import SearchField from '../components/home/SearchField';
import PostCard from '../components/home/PostCard';
import { useEffect, useState } from 'react';
import Empty from '../components/common/Empty';

//메인 페이지
const Home = () => {
  const [posts] = useState([]); //TODO: 데이터 연결할 때 setPosts 추가하기
  useEffect(() => {
    //TODO:
    // post data 받아와서 뿌려주기
    // setPost(받아온데이터)~
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
