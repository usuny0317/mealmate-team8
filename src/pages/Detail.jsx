import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../supabase/client.js';
import styled from 'styled-components';
import dayjs from 'dayjs';
import DetailAction from '../components/detail/DetailAction';

export const Detail = () => {
  const [post, setPost] = useState(null);
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('id');

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) {
        console.error('데이터 가져오기 오류:', error);
      } else {
        setPost(data);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (!post) {
    return <p>게시글을 불러오는 중...</p>;
  }

  return (
    <PageContainer>
      <ArticleContainer>
        <Title>{post.post_title}</Title>
        <AuthorInfo>
          작성자: {post.author_name} ·{' '}
          {dayjs(post.post_date).format('YYYY년 MM월 DD일 HH시 mm분')}
        </AuthorInfo>

        {post.post_img_url && (
          <ImageContainer>
            <img src={post.post_img_url} alt='게시글 이미지' />
          </ImageContainer>
        )}

        <Content>{post.post_content}</Content>

        <ExtraInfo>
          <p>❗️ 위치: {post.post_location}</p>
          <p>
            ⏱️ 시간:{' '}
            {dayjs(post.post_date).format('YYYY년 MM월 DD일 HH시 mm분')}
          </p>
          <p>👍 모집 인원수: {post.post_rec_cnt}</p>
        </ExtraInfo>

        {/* 함께해요 버튼 추가 */}

        <DetailAction postId={postId} userId={'사용자_아이디_여기'} />
      </ArticleContainer>
    </PageContainer>
  );
};

export default Detail;

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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-family: 'Noto Sans KR', sans-serif;
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
