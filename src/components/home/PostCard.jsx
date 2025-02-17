import dayjs from 'dayjs';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { TbBowlSpoonFilled } from 'react-icons/tb';
function PostCard({ postData }) {
  const navigate = useNavigate();

  const moveToMyPage = (targetNickname) => {
    navigate(`/user-posts/${targetNickname}`);
  };

  const moveToDetail = (targetId) => {
    navigate(`/detail/${targetId}`);
  };

  const lastOne = (totalPeople, accPeople) => {
    if (Number(totalPeople) - accPeople === 1)
      return <span className='stress'>(*마지막 1명)</span>;
  };

  return (
    <StPostCardWrapper>
      <p className='context'>
        <img
          className='profile'
          onClick={() => moveToMyPage(postData.author_name)}
          width='40px'
          height='40px'
          src={postData.users.profile}
          alt='user_profile'
        />
        <span>{postData.author_name}</span>
      </p>
      <div className='cardContent' onClick={() => moveToDetail(postData.id)}>
        <p className='smallText'>
          작성시간 : {dayjs(postData.created_at).format('YYYY-MM-DD HH:mm')}
        </p>
        <p className='postImage'>
          <img
            width='100%'
            height='200px'
            src={postData.post_img_url}
            alt={postData.post_title}
          />
        </p>

        <h4>{postData.post_title}</h4>
        <p className='context'>
          <TbBowlSpoonFilled />
          <span className='boldText'>{postData.post_menu}</span>
        </p>
        <p className='context'>{postData.post_location}</p>
        <p className='context'>
          {dayjs(postData.meeting_date).format('YYYY-MM-DD HH:ss')}
        </p>
        <p className='context'>
          {postData.post_rec_cnt}명 중&nbsp;
          {postData.actions.length}
          명이 모였어요!&nbsp;
          {lastOne(postData.post_rec_cnt, postData.actions.length)}
        </p>
      </div>
    </StPostCardWrapper>
  );
}

export default React.memo(PostCard);

const StPostCardWrapper = styled.section`
  flex: 1 1 300px;
  max-width: 300px;
  box-sizing: border-box;
  padding: 15px;
  height: 450px;
  border-radius: 5px;
  box-shadow: 1px 2px 1px #eaeaea;
  border: 1px solid ${({ theme }) => theme.colors.bgDark};
  .cardContent {
    cursor: pointer;
  }
  .stress {
    font-weight: bold;
    color: red;
  }
  .context {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }
  .context > .profile {
    margin-right: 15px;
    border-radius: 50%;
    cursor: pointer;
  }
  .boldText {
    font-weight: bold;
  }
  .postImage {
    text-align: center;
    object-fit: contain;
    img {
      object-fit: cover;
    }
  }
  h4 {
    font-weight: bold;
    font-size: 1.2rem;
    margin: 15px 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: ${(props) => props.theme.colors.text};
  }
  .smallText {
    font-size: 0.8rem;
    margin-bottom: 5px;
  }
`;
