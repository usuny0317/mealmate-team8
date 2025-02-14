import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../supabase/client.js';
import styled from 'styled-components';
import dayjs from 'dayjs';
import DetailAction from '../components/detail/DetailAction';

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

        if (error) throw error;
        setPost(data);
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
      }
    };

    if (postId) fetchPost();
  }, [postId]);

  // 데이터 로딩 중 표시
  if (!post) {
    return <p>게시글을 불러오는 중...</p>;
  }

  // 게시글 화면 렌더링
  return (
    <PageContainer>
      <ArticleContainer>
        <Title>{post.post_title}</Title>
        <AuthorInfo>
          작성자: {post.author_name} · {dayjs(post.post_date).format('YYYY년 MM월 DD일 HH시 mm분')}
        </AuthorInfo>
        {post.post_img_url && (
          <ImageContainer>
            <img src={post.post_img_url} alt='게시글 이미지' />
          </ImageContainer>
        )}
        <Content>{post.post_content}</Content>
        <ExtraInfo>
          <p>❗️ 위치: {post.post_location}</p>
          <p>⏱️ 시간: {dayjs(post.post_date).format('YYYY년 MM월 DD일 HH시 mm분')}</p>
          <p>👍 모집 인원수: {post.post_rec_cnt}</p>
        </ExtraInfo>
        {/* 함께해요 버튼 */}
        <DetailAction postId={postId} userId={'사용자_아이디_여기'} />
      </ArticleContainer>
    </PageContainer>
  );
};

export default Detail;

// Styled-components
const PageContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: #f7f7f7;
  display: flex;
  justify-content: center;
  padding: 10px;
`;

const ArticleContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  
  line-height: 1.8;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
`;

const AuthorInfo = styled.p`
  font-size: 16px;
  color: #777;
  margin-bottom: 20px;
`;

const ImageContainer = styled.div`
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

const Content = styled.p`
  font-size: 20px;
  color: #444;
  margin-bottom: 20px;
`;

const ExtraInfo = styled.div`
  font-size: 18px;
  color: #555;
  background: #fff3f3;
  padding: 15px;
  border-left: 4px solid #ff6b6b;
  border-radius: 4px;
  margin-top: 20px;
`;