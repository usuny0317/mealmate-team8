import { useContext, useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import { ALERT_TYPE } from '../../constants/alertConstant';
import PostCard from '../home/PostCard';
import { alert } from '../../utils/alert';
import AuthContext from '../../context/AuthContext';
//유저 아이디를 기준으로 닉네임을 검색
//닉네임을 기준으로 데이터 띄우기

export const MyPosts = () => {
  const { isLogin, loggedInUser } = useContext(AuthContext);

  //sweet alert
  const { ERROR } = ALERT_TYPE;
  const errorAlert = alert();

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPostsByUserNickName = async () => {
      //전역에설정되어있는 auth의 uid로 닉네임을 불러오는 요청
      const {
        data: [targetUser],
        errorGetUsers,
      } = await supabase
        .from('users')
        .select('nick_name')
        .eq('id', loggedInUser.id);

      //받아온 닉네임을 기준으로 포스트리스트에서  가져오기
      const { data, errorGetPosts } = await supabase
        .from('posts')
        .select('*')
        .eq('author_name', targetUser.nick_name);
      setPosts(data);

      if (errorGetUsers)
        errorAlert({ type: ERROR, content: errorGetUsers.message });
      if (errorGetPosts)
        errorAlert({ type: ERROR, content: errorGetPosts.message });
    };

    if (isLogin) getPostsByUserNickName();
  }, []);

  return (
    <div>
      {posts.map((data) => (
        <PostCard key={`post_${data.id}`} postData={data} />
      ))}
    </div>
  );
};
