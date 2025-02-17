import dayjs from 'dayjs';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

function PostCard({ postData }) {
  const navigate = useNavigate();

  const moveToMyPage = (targetNickname) => {
    navigate(`/user-posts/${targetNickname}`);
  };

  const moveToDetail = (targetId) => {
    navigate(`/detail/${targetId}`);
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
        <p className='context'>{postData.post_location}</p>
        <p className='context'>
          {dayjs(postData.meeting_date).format('YYYY-MM-DD HH:ss')}
        </p>
        <p className='context'>n명/{postData.post_rec_cnt}</p>
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
