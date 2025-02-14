import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import styled from "styled-components";
import { Heart } from "lucide-react";

export const DetailAction = ({ postId, userId }) => {
  const [likeCount, setLikeCount] = useState(0); // 좋아요 수
  const [liked, setLiked] = useState(false); // 현재 사용자가 눌렀는지 여부

  useEffect(() => {
    fetchLikeData();
  }, [postId, userId]);

  // Supabase에서 좋아요 데이터 가져오기
  const fetchLikeData = async () => {
    const { data, error } = await supabase
      .from("actions")
      .select("*", { count: "exact" })
      .eq("post_id", postId);

    if (error) {
      console.error("좋아요 데이터 불러오기 오류:", error);
      return;
    }

    setLikeCount(data.length);

    // 현재 사용자가 좋아요 눌렀는지 확인
    const userLike = data.find((action) => action.user_id === userId);
    setLiked(!!userLike);
  };

  // 🔹 좋아요(함께해요) 버튼 클릭 시
  const handleLike = async () => {
    if (liked) {
      // 이미 눌렀다면 삭제 (좋아요 취소)
      const { error } = await supabase
        .from("actions")
        .delete()
        .match({ post_id: postId, user_id: userId });

      if (error) {
        console.error("좋아요 취소 오류:", error);
        return;
      }
      setLikeCount((prev) => prev - 1);
    } else {
      // 새로 추가
      const { error } = await supabase
        .from("actions")
        .insert([{ post_id: postId, user_id: userId }]);

      if (error) {
        console.error("좋아요 추가 오류:", error);
        return;
      }
      setLikeCount((prev) => prev + 1);
    }

    setLiked(!liked);
  };

  return (
    <LikeContainer>
      <LikeButton onClick={handleLike} $liked={liked}>
        <Heart size={24} />
      </LikeButton>
      <LikeCount>{likeCount}</LikeCount>
    </LikeContainer>
  );
};

const LikeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
`;

const LikeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  color: ${(props) => (props.$liked ? "#ff4757" : "#999")}; // 눌렀을 때 색 변경

  &:hover {
    transform: scale(1.2);
  }
`;

const LikeCount = styled.span`
  font-size: 16px;
  color: #444;
  font-weight: bold;
`;

export default DetailAction;