import { useContext, useState } from 'react';
import { alert } from '../../utils/alert';
import { ALERT_TYPE } from '../../constants/alertConstant';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { main_select, sub_select } from '../../constants/signUpSelector';
import styled from 'styled-components';
import { supabase } from '../../supabase/client';
export const EditProfile = () => {
  const { loggedInUser, setLoggedInUser } = useContext(AuthContext);
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
    //입력된 정보가 없을때 뜨는 알럿
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

    //서버에 데이터업데이트후 업데이트된 데이터 가져오기
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', loggedInUser.id)
      .select('*');

    //똑같은 닉네임이 user테이블에 등록되어 있을때
    if (error?.code === '23505') {
      errorAlert({
        type: ERROR,
        content: '중복된 닉네임입니다 다른 닉네임을 입력해주세요',
      });
      return;
    }

    //이상한 요청을 보내서 데이터에 null값이 들어올때
    if (data === null) {
      errorAlert({
        type: ERROR,
        content: '잘못된 요청입니다. 잠시후 다시 시도해주세요',
      });
      return;
    }

    //페이지가 새로고침될때 세션스토리지에서 user정보를 가져오기 때문에 세션스토리지도 변경
    sessionStorage.setItem('loggedInUser', JSON.stringify(...data));

    //context로 관리중인 유저정보 바뀐정보로 동기화
    setLoggedInUser(...data);
    errorAlert({
      type: SUCCESS,
      content: '수정이 완료 되었습니다.',
    });
  };

  return (
    <StEditProfileWrapper>
      <div className='logged-user-info'>
        <div>
          <img src={userData.profile} width='300px' />
        </div>
        <div>
          <label htmlFor='nickname'>
            변경할 닉네임 <br />
          </label>
          <input
            type='text'
            value={userData.nick_name}
            onChange={(e) => {
              setUserData({ ...userData, nick_name: e.target.value });
            }}
          />
        </div>

        <div>
          지역
          <br />
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

        <div>성별: {userData.gender ? '남자' : '여자'}</div>

        <div>
          <button onClick={editProfileHandler}>수정하기</button>
        </div>
      </div>
    </StEditProfileWrapper>
  );
};

const StEditProfileWrapper = styled.div`
  width: 100vw;
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .logged-user-info {
    width: 50%;
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  .logged-user-info img {
    border-radius: 50%;
    object-fit: cover;
    aspect-ratio: 1 / 1;
    width: 200px;
  }
  input {
    width: 150px;
    padding: 10px 15px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s ease-in-out;
  }

  input:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
  }
  select {
    width: 150px;
    padding: 10px 15px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 16px;
    background-color: #fff;
    outline: none;
    transition: border-color 0.3s ease-in-out;
  }

  select:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
  }
  button {
    padding: 12px 20px;
    font-size: 16px;
    border: none;
    border-radius: 6px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    transition: background 0.3s ease-in-out;
  }

  button:hover {
    background-color: #0056b3;
  }
`;
