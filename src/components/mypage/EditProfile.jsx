import { useContext, useState } from 'react';
import { alert } from '../../utils/alert';
import { ALERT_TYPE } from '../../constants/alertConstant';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { main_select, sub_select } from '../../constants/signUpSelector';
export const EditProfile = () => {
  const { loggedInUser } = useContext(AuthContext);
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
        지역:
        <select
          value={userData.main_location}
          className='main_location'
          onChange={(e) => {
            setUserData({ ...userData, main_location: e.target.value });
          }}
        >
          {main_select.map((main) => {
            return (
              <option value={main} key={main}>
                {main}
              </option>
            );
          })}
        </select>
        <select
          value={userData.sub_location}
          className='sub_location'
          onChange={(e) => {
            setUserData({ ...userData, sub_location: e.target.value });
          }}
        >
          {sub_select[userData.main_location]?.map((sub) => {
            return (
              <option value={sub} key={sub}>
                {sub}
              </option>
            );
          })}
          {/* {console.log(sub_select[userData.main_location])} */}
          {/* sub_select,userData.main_location 왜 이건 undefined  */}
        </select>
      </div>
      <span>성별 : {userData.gender ? '남자' : '여자'}</span>
    </>
  );
};
