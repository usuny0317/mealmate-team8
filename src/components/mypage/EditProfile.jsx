import { useContext, useState } from 'react';
import { alert } from '../../utils/alert';
import { ALERT_TYPE } from '../../constants/alertConstant';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
export const EditProfile = () => {
  const { isLogin, loggedInUser } = useContext(AuthContext);
  const navigate = useNavigate();

  //스위트알럿설정값
  // const { ERROR } = ALERT_TYPE;
  // const errorAlert = alert();
  // errorAlert({ type: ERROR, content: '로그인 페이지로 이동합니다.' });

  //폼입력에 쓸 state
  const [userData, setUserData] = useState({
    nick_name: loggedInUser.nick_name,
    gender: loggedInUser.gender,
    main_location: loggedInUser.main_location,
    sub_location: loggedInUser.sub_location,
    profile: loggedInUser.profile,
  });

  return (
    <>
      <div>
        <img src={userData.profile} width='300px' />
      </div>
      <div>
        <label htmlFor='nickname'>변경할 닉네임 : </label>
        <input
          type='text'
          value={userData.nick_name}
          onChange={(e) => {
            setUserData({ ...userData, nick_name: e.target.value });
          }}
        />
      </div>
      <div>
        <label htmlFor='nickname'>시 : </label>
        <input
          type='text'
          value={userData.main_location}
          onChange={(e) => {
            setUserData({ ...userData, main_location: e.target.value });
          }}
        />
      </div>
      <div>
        <label htmlFor='nickname'>지역 : </label>
        <input
          type='text'
          value={userData.sub_location}
          onChange={(e) => {
            setUserData({ ...userData, sub_location: e.target.value });
          }}
        />
      </div>
      <span>성별 : {userData.gender ? '남자' : '여자'}</span>
    </>
  );
};
