import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../supabase/client.js';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { DetailAction } from '../components/detail/DetailAction';
import { CommentSection } from '../components/detail/CommentSection.jsx';
import { alert } from '../utils/alert.js';
import { ALERT_TYPE } from '../constants/alertConstant';

export const Detail = () => {
  // 게시글 데이터 상태
  const [post, setPost] = useState(null);
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('id');

  // 게시글 데이터를 비동기적으로 가져오는 함수 (try-catch 적용)
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', postId)
          .single();

        if (error) {
          throw error;
        }
        setPost(data);
      } catch (error) {
        // 에러 발생시 스왈을 이용하여 에러 표시
        alert()({
          type: ALERT_TYPE.ERROR,
          content: '게시글을 불러오는 중 오류가 발생했습니다.',
        });
        console.error('데이터 가져오기 오류:', error);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (!post) {
    return <p>게시글을 불러오는 중...</p>;
  }
  // 게시글 화면 렌더링
  return (
    <StPageContainer>
      <StArticleContainer>
        <StTitle>{post.post_title}</StTitle>
        <StAuthorInfo>
          작성자: {post.author_name} ·{' '}
          {dayjs(post.post_date).format('YYYY년 MM월 DD일 HH시 mm분')}
        </StAuthorInfo>
        {post.post_img_url && (
          <StImageContainer>
            <img src={post.post_img_url} alt='게시글 이미지' />
          </StImageContainer>
        )}
        <StContent>{post.post_content}</StContent>
        <StExtraInfo>
          <p>❗️ 위치: {post.post_location}</p>
          <p>📅 날짜: {dayjs(post.post_date).format('YYYY년 MM월 DD일')}</p>
          <p>⏱️ 시간: {dayjs(post.post_date).format('HH시 mm분')}</p>
          <p>👍 모집 인원수: {post.post_rec_cnt}</p>
        </StExtraInfo>
        {/* 함께해요 버튼 */}
        <DetailAction postId={postId} userId={'사용자_아이디_여기'} />
        <CommentSection></CommentSection>
      </StArticleContainer>
    </StPageContainer>
  );
};

export default Detail;

// Styled-components
const StPageContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: #f7f7f7;
  display: flex;
  justify-content: center;
  padding: 10px;
`;

const StArticleContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  background: #fff;
  padding: 40px;
  border-radius: 8px;

  line-height: 1.8;
`;

const StTitle = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
`;

const StAuthorInfo = styled.p`
  font-size: 16px;
  color: #777;
  margin-bottom: 20px;
`;

const StImageContainer = styled.div`
  width: 100%;
  overflow: hidden;
  border-radius: 6px;
  margin-bottom: 20px;
  img {
    width: 100%;
    height: auto;
    max-height: 450px;
    border-radius: 6px;
  }
`;

const StContent = styled.p`
  font-size: 20px;
  color: #444;
  margin-bottom: 20px;
`;

const StExtraInfo = styled.div`
  font-size: 18px;
  color: #555;
  background: #fff3f3;
  padding: 15px;
  border-left: 4px solid #ff6b6b;
  border-radius: 4px;
  margin-top: 20px;
`;
