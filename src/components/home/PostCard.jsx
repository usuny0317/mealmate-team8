import { useEffect } from 'react';
import styled from 'styled-components';

export default function PostCard({ postData }) {
  useEffect(() => {
    //TODO:
    // 1. 해당 유저의 id값으로 user 정보 받아오기
    // 2. 받아온 유저 정보의 nickname, profile로 글쓴이 세팅해주기
  }, []);

  return (
    <PostCardWrapper>
      <p className='context'>
        <img
          className='profile'
          width='50px'
          src='https://contents.creators.mypetlife.co.kr/content/uploads/2020/03/20175706/202003202Faf7a5a92a45c71f76391883a3e3ac572.jpg'
          alt='user_profile'
        />
        <span>글쓴이</span>
      </p>
      <p className='smallText'>작성시간 : {postData.post_date}</p>
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
      <p className='context'>{postData.post_date}</p>
      <p className='context'>n명/{postData.post_rec_cnt}</p>
    </PostCardWrapper>
  );
}

const PostCardWrapper = styled.section`
  flex: 1 1 400px;
  max-width: 400px;
  padding: 15px;
  height: 400px;
  border-radius: 5px;
  box-shadow: 1px 2px 1px #eaeaea;
  border: 1px solid ${({ theme }) => theme.colors.bgDark};
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
  }
  .smallText {
    font-size: 0.8rem;
    margin-bottom: 5px;
  }
`;
