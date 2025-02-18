import { useContext, useState } from 'react';
import { alert } from '../../utils/alert';
import { ALERT_TYPE } from '../../constants/alertConstant';
import AuthContext from '../../context/AuthContext';
import { main_select, sub_select } from '../../constants/signUpSelector';
import styled from 'styled-components';
import { supabase } from '../../supabase/client';
export const EditProfile = () => {
  const { loggedInUser, setLoggedInUser } = useContext(AuthContext);

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
      !imagePreview &&
      JSON.stringify({ ...loggedInUser, ...userData }) ===
        JSON.stringify(loggedInUser)
    ) {
      errorAlert({
        type: ERROR,
        content: '수정할 정보를 입력해 주세요',
      });
      return;
    }

    //업로드할 유저정보 객체 복사
    const upLoadData = { ...userData };

    const fetch = `public/upload/${new Date().getTime()}.webp`;
    //수정할 이미지가 있으면 바뀐 링크를 반영하기 위해 위에 작성
    if (imagePreview) {
      //스토지리에서 뽑아서 사용할 링크

      //이미지가 저장될 버킷 저장소의 주소를 profile 에 넣어줌
      upLoadData.profile =
        'https://akqkaonphmdqozkinveg.supabase.co/storage/v1/object/public/profile-images/' +
        fetch;
    }

    //서버에 데이터업데이트후 업데이트된 데이터 가져오기
    const { data, error } = await supabase
      .from('users')
      .update(upLoadData)
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

    if (imagePreview) {
      //스토리지에 업로드밑 링크 받아오기
      const uploadImage = await supabase.storage
        .from('profile-images')
        .upload(fetch, selectedFile);

      //이미지업로드실패시
      if (uploadImage?.error) {
        errorAlert({
          type: ERROR,
          content: '이미지 업로드 실패',
        });
        return;
      }

      //원래갖고있던 사용자의 이미지 주소를 바탕으로 버킷에서 삭제
      const removeImage = await supabase.storage
        .from('profile-images')
        .remove([loggedInUser.profile.split('/public/profile-images/')[1]]);

      //이미지삭제요청실패시
      if (removeImage?.error) {
        errorAlert({
          type: ERROR,
          content: '삭제실패',
        });
        return;
      }
    }

    //페이지가 새로고침될때 세션스토리지에서 user정보를 가져오기 때문에 세션스토리지도 변경
    sessionStorage.setItem('loggedInUser', JSON.stringify(...data));

    //context로 관리중인 유저정보 바뀐정보로 동기화
    setLoggedInUser(...data);
    errorAlert({
      type: SUCCESS,
      content: '수정이 완료 되었습니다.',
    });

    setImagePreview('');
    setSelectedFile('');
    setUserData(upLoadData);
  };

  //파일 미리보기를 위한 state
  const [imagePreview, setImagePreview] = useState('');

  //파일을 저장할 state
  const [selectedFile, setSelectedFile] = useState('');

  //미리보기로 보여주고 selectedFile에 선택된 파일이 들어감
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    const fileURL = URL.createObjectURL(e.target.files[0]);
    setImagePreview(fileURL);
  };

  return (
    <StEditProfileWrapper>
      <div className='logged-user-info'>
        {/* 이미지를 보여줄 부분,파일이 선택이 안되어 있으면 원래이미지를 보여줌 */}
        {imagePreview ? (
          <div>
            <img src={imagePreview} width='300px' />
          </div>
        ) : (
          <div>
            <img src={userData.profile} width='300px' />
          </div>
        )}

        {/* 파일선택부분 */}
        <div>
          변경할 이미지 파일 선택
          <br />
          <input type='file' accept='image/*' onChange={handleFileChange} />
          <button
            onClick={() => {
              setImagePreview('');
            }}
          >
            이미지 선택취소
          </button>
        </div>

        {/* 닉네임변경 */}
        <div>
          변경할 닉네임 <br />
          <input
            type='text'
            value={userData.nick_name}
            onChange={(e) => {
              setUserData({ ...userData, nick_name: e.target.value });
            }}
          />
        </div>

        {/* 지역선택셀렉트박스 */}
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
          <button onClick={editProfileHandler} className='edit'>
            수정하기
          </button>
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
  input-text {
    width: 150px;
    padding: 10px 15px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s ease-in-out;
  }
  .input-file {
    /* 기본 파일 입력의 스타일을 조정 */
    width: 0; /* 크기 숨기기 */
    height: 0; /* 크기 숨기기 */
    padding: 0; /* 패딩 숨기기 */
    border: none; /* 테두리 숨기기 */
    visibility: hidden; /* 텍스트와 버튼 숨기기 */
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
  .edit {
    padding: 12px 20px;
    font-size: 16px;
    border: none;
    border-radius: 6px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    transition: background 0.3s ease-in-out;
  }

  .edit:hover {
    background-color: #0056b3;
  }
`;
