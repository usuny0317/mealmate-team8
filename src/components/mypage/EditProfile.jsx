import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import { alert } from '../../utils/alert';
import { ALERT_TYPE } from '../../constants/alertConstant';
export const EditProfile = () => {
  const 전역값으로받아올유저아이디 = 'c712d979-726f-4101-a794-519d5ff79c09';
  const isLogin = '로그인이 되어있습니다.';

  //스위트알럿설정값
  const { ERROR } = ALERT_TYPE;
  const errorAlert = alert();
  //폼입력에 쓸 state
  const [userData, setUserData] = useState({
    nick_name: '',
    gender: '',
    main_location: '',
    sub_location: '',
    profile:
      'https://play-lh.googleusercontent.com/38AGKCqmbjZ9OuWx4YjssAz3Y0DTWbiM5HB0ove1pNBq_o9mtWfGszjZNxZdwt_vgHo=w240-h480-rw',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', 전역값으로받아올유저아이디)
        .single();
      if (error) {
        errorAlert({
          type: ERROR,
          content: error.message,
        });
      }
      setUserData(data);
    };

    //유저상태값이 들어갈 부분입니다.
    if (isLogin) {
      fetchUserProfile();
    }
  }, []);

  return (
    <>
      <img src={userData.profile} width='300px' />
      <label htmlFor='nickname'>변경할 닉네임</label>
      <input
        type='text'
        value={userData.nick_name}
        onChange={(e) => {
          setUserData({ ...userData, nick_name: e.target.value });
        }}
      />
      <label htmlFor='nickname'>시</label>
      <input
        type='text'
        value={userData.main_location}
        onChange={(e) => {
          setUserData({ ...userData, main_location: e.target.value });
        }}
      />
      <label htmlFor='nickname'>지역</label>
      <input
        type='text'
        value={userData.sub_location}
        onChange={(e) => {
          setUserData({ ...userData, sub_location: e.target.value });
        }}
      />
      <span>{userData.gender ? '남자' : '여자'}</span>
    </>
  );
};
