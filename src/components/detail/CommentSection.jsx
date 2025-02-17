import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import styled from 'styled-components';

export const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [userId, setUserId] = useState(null);
  const [nickName, setNickName] = useState('');

  // 처음 로딩 때 사용자 정보(사용자 ID 및 닉네임)를 가져옵니다.
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Supabase로 사용자 정보 가져오기
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) throw new Error('로그인 필요');

        // 가져온 사용자 ID를 상태에 저장
        setUserId(user.id);

        // 사용자 테이블(users)에서 사용자 닉네임 가져오기
        const { data: userInfo, error: userError } = await supabase
          .from('users')
          .select('nick_name')
          .eq('id', user.id)
          .single();

        if (userError) throw new Error(`닉네임 조회 실패: ${userError.message}`);
        setNickName(userInfo.nick_name);
      } catch (error) {
        console.error('유저 정보 가져오기 실패:', error.message);
      }
    };

    fetchUser();
  }, []);

  // 지정된 postId에 속한 댓글을 가져와서 상태에 설정합니다.
  const fetchComments = async () => {
    try {
      // Supabase에서 comments 테이블 조회
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (error) throw new Error(`댓글 불러오기 실패: ${error.message}`);
      setComments(data);
    } catch (error) {
      console.error('댓글 가져오기 실패:', error.message);
    }
  };

  // postId 변경 시 댓글을 불러옵니다.
  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  // 사용자가 입력한 내용을 바탕으로 새로운 댓글을 추가합니다.
  const handleAddComment = async () => {
    // 댓글이 비어 있는지 확인
    if (!commentText.trim()) {
      alert('첫 댓글 입력해 보세요~!');
      return;
    }

    // 로그인되지 않은 사용자 차단
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      // comments 테이블에 새 댓글 삽입
      const { error } = await supabase
        .from('comments')
        .insert([{ 
          post_id: postId, 
          user_id: userId, 
          nick_name: nickName, 
          content: commentText 
        }]);

      if (error) throw new Error(`댓글 추가 실패: ${error.message}`);

      // 입력 필드 초기화 후 댓글 새로고침
      setCommentText('');
      fetchComments();
    } catch (error) {
      console.error('댓글 추가 실패:', error.message);
    }
  };

  // 댓글을 삭제하는 함수
  const handleDeleteComment = async (commentId) => {
    // 삭제 확인 메시지를 사용자에게 표시
    const confirmDelete = window.confirm('정말로 이 댓글을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      // Supabase에서 지정된 ID의 댓글 삭제
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw new Error(`댓글 삭제 실패: ${error.message}`);

      alert('댓글이 삭제되었습니다.');
      // 삭제 후 최신 댓글 목록을 다시 불러옴
      fetchComments();
    } catch (error) {
      console.error('댓글 삭제 실패:', error.message);
    }
  };

  return (
    <CommentContainer>
      {/* 댓글 입력 폼 */}
      <InputContainer>
        <input
          type="text"
          placeholder="댓글을 입력하세요..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={!userId}
        />
        <button onClick={handleAddComment} disabled={!userId}>
          댓글 작성
        </button>
      </InputContainer>

      {/* 댓글 리스트 */}
      <CommentList>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem key={comment.id}>
              <CommentHeader>
                <strong>{comment.nick_name || '익명'}</strong>
                {/* 현재 로그인한 사용자와 댓글 작성자가 일치할 때만 삭제 버튼 표시 */}
                {comment.user_id === userId && (
                  <DeleteButton onClick={() => handleDeleteComment(comment.id)}>
                    삭제
                  </DeleteButton>
                )}
              </CommentHeader>
              <p>{comment.content}</p>
              <span>{new Date(comment.created_at).toLocaleString()}</span>
            </CommentItem>
          ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </CommentList>
    </CommentContainer>
  );
};

// 스타일 정의
const CommentContainer = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: #f3f3f3;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;

  input {
    flex: 1;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    padding: 10px 15px;
    font-size: 14px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;

    &:hover:enabled {
      background-color: #218838;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CommentItem = styled.div`
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;

  strong {
    display: block;
    margin-bottom: 4px;
    color: #007bff;
  }

  p {
    font-size: 14px;
    color: #333;
  }

  span {
    font-size: 12px;
    color: #777;
  }
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DeleteButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 6px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background-color: #c82333;
  }
`;
