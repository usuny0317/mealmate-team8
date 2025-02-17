import { useContext, useEffect, useMemo, useState } from 'react';
import { ImSpoonKnife } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Empty from '../components/common/Empty';
import PostCard from '../components/home/PostCard';
import SearchField from '../components/home/SearchField';
import { ALERT_TYPE } from '../constants/alertConstant';
import { supabase } from '../supabase/client';
import { alert } from '../utils/alert';
import { removeAllBlank } from '../utils/trimText';
import AuthContext from '../context/AuthContext';
const { ERROR } = ALERT_TYPE;

const postsPerPage = 12; // 한 페이지 당 보일 게시글의 개수

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(null); // 서버에서 받아온 게시글 리스트
  const [totalPosts, setTotalPosts] = useState(0); // 전체 게시글의 개수
  const [page, setPage] = useState(1); // 현재 페이지
  const [searchField, setSearchField] = useState({
    searchCategory: '',
    searchText: '',
  }); // searchCategory : 검색 기준 (selectBox) , searchText : 검색 내용 (inputBox)
  const { isLogin } = useContext(AuthContext);

  const totalPages = useMemo(
    () => Math.ceil(totalPosts / postsPerPage),
    [totalPosts]
  ); // 총 페이지 개수

  const pages = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  ); // 페이지 넘버링

  useEffect(() => {
    const fetchPostsData = async () => {
      try {
        const { searchCategory, searchText } = searchField;
        const startIdx = (page - 1) * postsPerPage; // pagination 시작 page
        const endIdx = startIdx + postsPerPage - 1; // pagination 마지막 page

        // countQuery : 게시글 전체 개수를 불러오는 api (pagination 넘버링에 필요)
        let countQuery = supabase
          .from('posts')
          .select('*', { count: 'exact', head: true });

        // dateQuery : range범위의 데이터를 불러오는 api (해당 페이지에 보여질 데이터만 가져옴)
        let dataQuery = supabase
          .from('posts')
          .select('*, users!inner(profile)')
          .range(startIdx, endIdx);

        const searchTarget = removeAllBlank(searchText); // 빈 문자열, 혹은 띄어쓰기 포함하여 검색해도 문제없도록 빈칸 제거 처리

        // 검색 내용이 있을 경우 ilike로 데이터를 걸러서 가져옴
        if (searchTarget !== '') {
          countQuery = countQuery.ilike(searchCategory, `%${searchTarget}%`);
          dataQuery = dataQuery.ilike(searchCategory, `%${searchTarget}%`);
        }

        const { count, error: countError } = await countQuery;
        const { data, error: dataError } = await dataQuery;

        if (countError) throw countError;
        if (dataError) throw dataError;
        setTotalPosts(count);
        setPosts(data);
      } catch (error) {
        alert()({
          type: ERROR,
          content: error.message,
        });
      }
    };
    fetchPostsData();
  }, [page, searchField]);

  // 게시글 등록 페이지로 이동
  const moveToPostBoard = () => {
    if (isLogin) navigate('/posteditior');
    else {
      alert()({
        type: ERROR,
        content: '먼저 로그인을 해주세요.',
      }).then((res) => {
        if (res.isConfirmed) navigate('/login');
      });
    }
  };

  return (
    <StHomeWrapper>
      <article id='home'>
        <SearchField setSearchField={setSearchField} setPage={setPage} />
        <div id='postButtonField'>
          <button onClick={moveToPostBoard}>
            <ImSpoonKnife className='buttonIcon' size={18} />
            Meal Mate 구하러 가기
          </button>
        </div>

        {posts?.length === 0 ? (
          <Empty />
        ) : (
          <div className='postCards'>
            {posts?.map((data) => (
              <PostCard key={`post_${data.id}`} postData={data} />
            ))}
          </div>
        )}
      </article>
      {posts && (
        <ul style={{ display: 'flex', justifyContent: 'center' }}>
          {pages.map((pageIdx) => (
            <li
              style={{ margin: '0 10px', cursor: 'pointer' }}
              key={`pageNumber_${pageIdx}`}
              onClick={() => setPage(pageIdx)}
            >
              {pageIdx}
            </li>
          ))}
        </ul>
      )}
    </StHomeWrapper>
  );
};

export default Home;
const StHomeWrapper = styled.div`
  padding: 10vh 0;
  #home {
    width: 80vw;
    margin: 0 auto;
    min-width: 300px;
    max-width: 1440px;
    margin-bottom: 50px;
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
