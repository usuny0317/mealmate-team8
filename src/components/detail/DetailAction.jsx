import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import styled from 'styled-components';
import { Heart } from 'lucide-react';

export const DetailAction = ({ postId }) => {
  // 좋아요 수와 사용자 상태 관리
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [userId, setUserId] = useState(null);
  const [limitPeople, setLimitPeople] = useState(0);
  const [authorName, setAuthorName] = useState('');
  const [userNickName, setUserNickName] = useState('');

  // 페이지 접속시 사용자 정보와 좋아요 데이터 로드
  useEffect(() => {
    if (postId) {
      fetchUserInfo();
    }
  }, [postId]);

  // 로그인된 사용자 정보 가져오기
  const fetchUserInfo = async () => {
    try {
      // Supabase auth를 통해 현재 로그인된 사용자 정보 가져오기
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user)
        throw new Error(`인증 실패: ${authError?.message}`);

      // 사용자 ID 설정
      setUserId(user.id);

      // 사용자 닉네임 가져오기
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('nick_name')
        .eq('id', user.id)
        .single();
      if (userError)
        throw new Error(`닉네임 가져오기 실패: ${userError.message}`);

      setUserNickName(userData.nick_name);

      // 좋아요 데이터 가져오기
      fetchLikeData(user.id, userData.nick_name);
    } catch (error) {
      console.error(`[ERROR] 사용자 정보 로딩 실패: ${error.message}`);
    }
  };

  // 특정 게시글의 좋아요 데이터 가져오기
  const fetchLikeData = async (currentUserId) => {
    try {
      // Supabase에서 특정 게시글의 좋아요 데이터 조회
      const { data: likedata, error: likeerror } = await supabase
        .from('actions')
        .select('*')
        .eq('post_id', postId);
      if (likeerror)
        throw new Error(`좋아요 데이터 불러오기 실패: ${likeerror.message}`);

      // 좋아요 수 설정 현재 사용자가 좋아요를 눌렀는지 확인
      setLikeCount(likedata.length);
      const userLike = likedata.some(
        (action) => action.user_id === currentUserId
      );
      setLiked(userLike);

      // posts 테이블에서 모집 인원 및 작성자 닉네임 가져오기
      const { data: postdata, error: posterror } = await supabase
        .from('posts')
        .select('post_rec_cnt, author_name')
        .eq('id', postId)
        .single();
      if (posterror)
        throw new Error(`게시글 데이터 불러오기 실패: ${posterror.message}`);

      setLimitPeople(postdata.post_rec_cnt);
      setAuthorName(postdata.author_name);
    } catch (error) {
      console.error(`[ERROR] fetchLikeData 실패: ${error.message}`);
    }
  };

  // 좋아요 버튼 클릭 시 이벤트 처리
  const handleLike = async () => {
    // 자신의 게시물에는 좋아요 금지
    if (userNickName === authorName) {
      alert('자신의 게시물에는 좋아요를 누를 수 없습니다.');
      return;
    }

    // 좋아요 수가 모집 인원을 초과하면 경고
    if (!liked && likeCount >= limitPeople) {
      alert('최대 모집 인원을 초과했습니다.');
      return;
    }

    try {
      if (liked) {
        // 사용자가 누른 좋아요 삭제
        const { error } = await supabase
          .from('actions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);
        if (error) throw new Error(`좋아요 취소 실패: ${error.message}`);
      } else {
        // 새로운 좋아요 추가
        const { error } = await supabase
          .from('actions')
          .insert([{ post_id: postId, user_id: userId }]);

        if (error) throw new Error(`좋아요 추가 실패: ${error.message}`);
      }
      // 좋아요 데이터 다시 불러오기
      fetchLikeData(userId, userNickName);
    } catch (error) {
      console.error(`좋아요 실패: ${error.message}`);
    }
  };

  return (
    <StLikeContainer>
      <StLikeButton onClick={handleLike} $liked={liked} disabled={!userId}>
        <Heart size={24} />
      </StLikeButton>
      <StLikeCount>{likeCount}</StLikeCount>
    </StLikeContainer>
  );
};

// 스타일 정의
const StLikeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
`;

const StLikeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  color: ${(props) => (props.$liked ? '#ff4757' : '#999')};

  &:hover:enabled {
    transform: scale(1.2);
  }

  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const StLikeCount = styled.span`
  font-size: 16px;
  color: #444;
  font-weight: bold;
`;
