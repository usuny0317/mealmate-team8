import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client.js';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { DetailAction } from '../components/detail/DetailAction';
import { CommentSection } from '../components/detail/CommentSection';
import { alert } from '../utils/alert.js';
import { ALERT_TYPE } from '../constants/alertConstant';
import AuthContext from '../context/AuthContext.jsx';

export const Detail = () => {
  // 게시글 데이터와 사용자 ID 상태 관리
  const [post, setPost] = useState(null);
  const [userId, setUserId] = useState(null);

  // 패스 파라미터로 postId 가져오기
  const { id: postId } = useParams();

  // 페이지 이동을 위한 navigate 함수
  const navigate = useNavigate();

  // AuthContext를 통해 로그인 상태 가져오기
  const { isLogin } = useContext(AuthContext);

  // 스위트 알러트를 사용하기 위한 alert 함수
  const errorAlert = alert();

  // 디테일 페이지 접속시 로그인 상태 확인
  useEffect(() => {
    if (!isLogin) {
      errorAlert({
        type: ALERT_TYPE.ERROR,
        content: '로그인이 필요합니다. 로그인 페이지로 이동합니다.',
      }).then((res) => {
        if (res.isConfirmed) navigate('/login', { replace: true });
      });
    }
  }, [isLogin, navigate, errorAlert]);

  // 로그인되지 않았으면 페이지 안보여주기
  if (!isLogin) {
    return null;
  }; 

  // 현재 로그인된 사용자 ID를 가져오는 함수
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) throw error;
        if (user) setUserId(user.id);
      } catch (error) {
        console.error('유저 인증 실패:', error);
      }
    };
    fetchUser();
  }, []);

  // 게시글 데이터 가져오기
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
        errorAlert({
          type: ALERT_TYPE.ERROR,
          content: '게시글을 불러오는 중 오류가 발생했습니다.',
        });
        console.error('게시글 가져오기 오류:', error);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, errorAlert]);

  // 데이터 로딩 중 표시할 내용
  if (!post) {
    return <p>게시글을 불러오는 중...</p>;
  }

  // 게시글 수정 버튼 클릭 이벤트
  const handleEdit = () => {
    navigate(`/posteditior?id=${postId}`);
  };

  // 게시글 삭제 버튼 클릭 이벤트
  const handleDelete = async () => {
    const confirmDelete = window.confirm('정말로 이 게시글을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      alert('게시글이 삭제되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('게시글 삭제 실패:', error.message);
    }
  };

  // 디테일 페이지 렌더링
  return (
    <StPageContainer>
      <StArticleContainer>
        {/* 게시글 제목 및 수정/삭제 버튼 */}
        <StTitleContainer>
          <StTitle>{post.post_title}</StTitle>
          {/* 조건부 렌더링 (userid가 posts테이블의 userid와 같을때만 버튼 보이기!) */}
          {userId === post.user_id && (
            <StButtonContainer>
              <StEditButton onClick={handleEdit}>수정</StEditButton>
              <StDeleteButton onClick={handleDelete}>삭제</StDeleteButton>
            </StButtonContainer>
          )}
        </StTitleContainer>

        {/* 작성자 정보 표시 */}
        <StAuthorInfo>
          작성자: {post.author_name} ·{' '}
          {dayjs(post.created_at).format('YYYY년 MM월 DD일 HH시 mm분')}
        </StAuthorInfo>

        {/* 게시글 이미지 표시 */}
        {post.post_img_url ? (
          <StImageContainer>
            <img src={post.post_img_url || null} alt='게시글 이미지' />
          </StImageContainer>
        ) : (
          <StImageContainer>
            <img src='/default-image.png' alt='기본 이미지' />
          </StImageContainer>
        )}

        {/* 게시글 내용 표시 */}
        <StContent>{post.post_content}</StContent>

        {/* 추가 정보 표시 */}
        <StExtraInfo>
          <p>메뉴: {post.post_menu}</p>
          <p>위치: {post.post_location}</p>
          <p>날짜: {dayjs(post.meeting_date).format('YYYY년 MM월 DD일')}</p>
          <p>시간: {dayjs(post.meeting_date).format('HH시 mm분')}</p>
          <p>모집 인원수: {post.post_rec_cnt}</p>
        </StExtraInfo>

        {/* 좋아요(함께해요) 버튼 */}
        {userId && <DetailAction postId={postId} userId={userId} />}

        {/* 댓글 섹션 */}
        <CommentSection postId={postId} />
      </StArticleContainer>
    </StPageContainer>
  );
};

// 페이지 전체 컨테이너 스타일링
const StPageContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: #f7f7f7;
  display: flex;
  justify-content: center;
  padding: 10px;
`;

// 게시글 콘텐츠 컨테이너 스타일링
const StArticleContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px;
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  line-height: 1.8;
`;

// 제목 및 버튼 컨테이너 스타일링
const StTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

// 제목 스타일링
const StTitle = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #333;
`;

// 버튼 컨테이너 스타일링
const StButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

// 수정 버튼 스타일링
const StEditButton = styled.button`
  padding: 6px 12px;
  font-size: 14px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #357ab7;
  }
`;

// 삭제 버튼 스타일링
const StDeleteButton = styled.button`
  padding: 6px 12px;
  font-size: 14px;
  background-color: #e24a4a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #c93b3b;
  }
`;

// 작성자 정보 스타일링
const StAuthorInfo = styled.p`
  font-size: 16px;
  color: #777;
  margin-bottom: 20px;
`;

// 이미지 컨테이너 스타일링
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

// 게시글 내용 스타일링
const StContent = styled.p`
  font-size: 20px;
  color: #444;
  margin-bottom: 20px;
`;

// 게시글 추가 정보 스타일링
const StExtraInfo = styled.div`
  font-size: 18px;
  color: #555;
  background: #fff3f3;
  padding: 15px;
  border-left: 4px solid #ff6b6b;
  border-radius: 4px;
  margin-top: 20px;
`;

export default Detail;
