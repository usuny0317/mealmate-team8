import styled from 'styled-components';
import SearchField from '../components/home/SearchField';
import PostCard from '../components/home/PostCard';
import { useEffect, useState } from 'react';
import Empty from '../components/common/Empty';
import { ALERT_TYPE } from '../constants/alertConstant';
import { supabase } from '../supabase/client';
import { alert } from '../utils/alert';
import { ImSpoonKnife } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
const { ERROR } = ALERT_TYPE;

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]); // 서버에서 받아온 게시글 리스트

  // 메인 페이지 진입 시 서버에서 모든 post 데이터 요청
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

  // 게시글 등록 페이지로 이동
  const moveToPostBoard = () => {
    navigate('/posteditior');
  };

  return (
    <StHomeWrapper>
      <article id='home'>
        <SearchField />
        <div id='postButtonField'>
          <button onClick={moveToPostBoard}>
            <ImSpoonKnife className='buttonIcon' size={18} />
            Meal Mate 구하러 가기
          </button>
        </div>

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
    padding: 10vh 0;
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
  #postButtonField {
    text-align: center;
    margin-bottom: 4vh;
  }
  button {
    vertical-align: middle;
    padding: 10px;
    width: 30%;
    min-width: 300px;
    background-color: ${(props) => props.theme.colors.primaryLight};
    border: none;
    color: #fff;
    box-shadow: 1px 2px 1px #eaeaea;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1rem;
  }
  .buttonIcon {
    margin-right: 10px;
  }
`;
