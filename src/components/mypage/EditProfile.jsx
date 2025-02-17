import { useContext, useState } from 'react';
import { alert } from '../../utils/alert';
import { ALERT_TYPE } from '../../constants/alertConstant';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { main_select, sub_select } from '../../constants/signUpSelector';
import styled from 'styled-components';
import { supabase } from '../../supabase/client';
export const EditProfile = () => {
  const { loggedInUser, setUserChange } = useContext(AuthContext);
  const navigate = useNavigate();

  //스위트알럿설정값
  const { ERROR, SUCCESS } = ALERT_TYPE;
  const errorAlert = alert();

  //폼입력에 쓸 state
  const [userData, setUserData] = useState({
    nick_name: loggedInUser.nick_name,
    gender: loggedInUser.gender,
    main_location: loggedInUser.main_location,
    sub_location: loggedInUser.sub_location,
    profile: loggedInUser.profile,
  });

  const editProfileHandler = async () => {
    if (
      JSON.stringify({ ...loggedInUser, ...userData }) ===
      JSON.stringify(loggedInUser)
    ) {
      errorAlert({
        type: ERROR,
        content: '수정할 정보를 입력해 주세요',
      });
      return;
    }
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', loggedInUser.id)
      .select('*');
    if (error?.code === '23505') {
      errorAlert({
        type: ERROR,
        content: '중복된 닉네임입니다 다른 닉네임을 입력해주세요',
      });
      return;
    }
    if (data === null) {
      errorAlert({
        type: ERROR,
        content: '잘못된 요청입니다. 잠시후 다시 시도해주세요',
      });
      return;
    }
    //페이지가 새로고침될때 세션스토리지에서 user정보를 가져오기 때문에 세션스토리지도 변경
    sessionStorage.setItem('loggedInUser', JSON.stringify(...data));
    setUserChange((prev) => !prev);
    errorAlert({
      type: SUCCESS,
      content: '수정이 완료 되었습니다.',
    });
  };

  return (
    <StEditProfileWrapper>
      <div>
        <div className='logged-user-info'>
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
            </select>
          </div>
          <span>성별 : {userData.gender ? '남자' : '여자'}</span>
        </div>
        <div>
          <button onClick={editProfileHandler}>수정하기</button>
        </div>
      </div>
    </StEditProfileWrapper>
  );
};

const StEditProfileWrapper = styled.div`
  background-color: green;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .logged-user-info {
    display: flex;
    flex-direction: column;
  }
  .logged-user-info img {
    border-radius: 50%;
    object-fit: cover;
    aspect-ratio: 1 / 1;
    width: 200px;
  }
`;
