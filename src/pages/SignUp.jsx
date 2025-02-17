import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { main_select, get_sub_select } from '../constants/signUpSelector';
import { supabase } from '../supabase/client';

import { alert } from '../utils/alert';
import { ALERT_TYPE } from '../constants/alertConstant';
import styled from 'styled-components';

//회원가입페이지지
const Signup = () => {
  //이미지 도전
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState('');
  const defalt_img = '/user2.png';
  //값 보내주고 관리하기 위한 state
  //일단 작성하고 나중에 묶을까 생각 중입니다.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState(true);
  const [main_location, setMain_location] = useState('서울특별시');
  const [sub_location, setSub_location] = useState('');
  const [profile, setProfile] = useState(null);

  const [check, setCheck] = useState(false);
  //셀렉트 박스 전용
  const mainselect = main_select;
  //select박스에서 두번째 인자 전용입니다!
  const [get_sub, setget_sub] = useState([]);

  //완료 후 로그인으로 보내 줄 navigate
  const navigate = useNavigate();

  //스위트alert
  const { SUCCESS, ERROR } = ALERT_TYPE;
  const SignupAlert = alert();

  //select Box useEffect
  useEffect(() => {
    //메인 비어있을 때 업데이트 null.map 오류 나지 않게..
    if (main_location) {
      setget_sub(get_sub_select(main_location));
      setSub_location(get_sub_select(main_location)[0]);
    }
  }, [main_location]);

  //닉네임 중복 핸들러
  const handleNickname = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('users') // 테이블 이름
        .select('nick_name');
      if (error) throw error;

      const nickNames = data.map((item) => item.nick_name);

      if (!nickNames.includes(nickname) && nickname !== '') {
        setCheck(true);
        SignupAlert({ type: SUCCESS, content: '사용가능합니다!' });
      } else if (nickname === '') {
        throw '닉네임이 빈 값입니다.';
      } else {
        throw '중복 닉네임입니다!';
      }
    } catch (error) {
      SignupAlert({ type: ERROR, content: '실패했습니다!' + error });
    }
  };

  //회원가입 핸들러
  const handleSignup = async (e) => {
    e.preventDefault();
    //수파 베이스 연결 시도하기기
    try {
      if (!check) throw '닉네임 중복 검사를 해주세요';
      else {
        // 이메일 비밀번호로 회원가입!!
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authErr) throw authErr;

        //정보가 없는 경우도 추가했습니다.
        if (!authData || !authData.user) {
          throw new Error('회원가입 실패: 유저 정보가 없습니다.');
        }

        //스토리지에 이미지 업로드
        let fileUrl = defalt_img;
        console.log('', profile);
        if (profile) {
          console.log('프로필 값은 있네용');
          const fileExtension = profile.name.split('.').pop();
          console.log('fileEx', fileExtension);
          const filePath = `upload/${Date.now()}.${fileExtension}`;
          console.log('filePath', filePath);

          //새 이미지 업로드
          const { error } = await supabase.storage
            .from('profile-images')
            .upload(`public/${filePath}`, profile);
          if (error) throw error;
          fileUrl = getImageUrl(filePath);
        } else {
          fileUrl = defalt_img;
        }
        console.log(fileUrl);

        const { error: userErr } = await supabase.from('users').insert({
          id: authData.user.id,
          nick_name: nickname,
          gender,
          main_location,
          sub_location,
          profile: fileUrl,
        });

        if (userErr) throw userErr;

        SignupAlert({
          type: SUCCESS,
          content: '회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.',
        });

        navigate('/login');
      }
    } catch (error) {
      SignupAlert({
        type: ERROR,
        content: '회원가입에 실패했습니다!!' + error,
      });
    }
  };

  //이미지 핸들러
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setImagePreview(fileURL);
      setProfile(selectedFile);
    }

    //url 객체 > 스토리지 url 뽑기 > 뽑은 걸 컬럼에에
    //스토리지 > url 가져와서 테이블에 저장
  };

  const handleDeletImg = (e) => {
    e.stopPropagation();
    setProfile('');
    setImagePreview(defalt_img);
  };

  const getImageUrl = (imageName) => {
    return `${
      import.meta.env.VITE_APP_SUPABASE_URL
    }/storage/v1/object/public/profile-images/public/${imageName}`;
  };

  return (
    <StWrapper>
      <div className='img-div'>
        <img src='/mm_logo.svg' />
        <div className='title'>회원가입</div>
      </div>

      <div className='form-div'>
        <form onSubmit={handleSignup}>
          <label>
            이메일:{' '}
            <input
              placeholder='이메일'
              type='email'
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
          </label>
          <label>
            비밀번호:{' '}
            <input
              type='password'
              minLength={6}
              required
              placeholder='비밀번호'
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </label>
          <label>
            닉네임:{' '}
            <input
              className='nickname-input'
              required
              placeholder='닉네임'
              onChange={(e) => {
                setNickname(e.target.value);
              }}
            />
            <button type='button' onClick={handleNickname}>
              중복 검사
            </button>
          </label>
          <div className='radio-select-div'>
            <div className='left-radio-div'>
              성별:
              <label className='radio-label'>
                남성
                <input
                  className='radio-input'
                  type='radio'
                  value={true}
                  name='gender'
                  defaultChecked
                  onChange={() => {
                    setGender(true);
                  }}
                />
              </label>
              <label className='radio-label'>
                여성
                <input
                  className='radio-input'
                  type='radio'
                  value={false}
                  name='gender'
                  onChange={() => {
                    setGender(false);
                  }}
                />
              </label>
            </div>
            <div className='right-select-div'>
              <label>
                지역:
                <select
                  value={main_location}
                  className='main_location'
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    setMain_location(selectedValue);
                  }}
                >
                  {mainselect.map((main) => {
                    return (
                      <option value={main} key={main}>
                        {main}
                      </option>
                    );
                  })}
                </select>
                <select
                  value={sub_location}
                  className='sub_location'
                  onChange={(e) => {
                    setSub_location(e.target.value);
                  }}
                >
                  {
                    //배열인지 확인, 배열일 때만 동작하게 && 사용.
                    Array.isArray(get_sub) &&
                      get_sub.map((sub) => {
                        return (
                          <option value={sub} key={sub}>
                            {sub}
                          </option>
                        );
                      })
                  }
                </select>
              </label>
            </div>
          </div>

          <label className='img-upload-label'>
            프로필:
            <div>
              <input
                type='file'
                id='inputFile'
                accept='image/*'
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
            {imagePreview && (
              <div>
                {' '}
                <img
                  src={imagePreview}
                  alt='이미지 미리보기'
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                  }}
                />
              </div>
            )}
            <button type='button' onClick={handleDeletImg}>
              이미지 삭제
            </button>
          </label>
          <button
            type='submit'
            onClick={() => {
              console.log('' + profile);
            }}
          >
            가입하기
          </button>
        </form>
      </div>
    </StWrapper>
  );
};

export default Signup;

const StWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  color: black;

  img {
    width: 100px;
    height: 100px;
  }
  .img-div {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
  }

  .form-div {
    display: flex;
    justify-content: flex-start;
  }

  form {
    border: 2px solid #000000;
    padding: 20px;
    display: flex;
    flex-direction: column;
    font-size: 18px;
    gap: 16px;

    margin-right: 30px;
  }
  input {
    flex: 1;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: calc(100% - 110px); /* input이 남은 공간 채우기 */
    box-sizing: border-box;
    margin-left: 10px;
  }
  form label {
    width: 100%;
    text-align: right;
  }
  .nickname-input {
    width: 65%;
    margin-right: 11px;
  }

  button {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: white;
    border-radius: 3px;
    font-weight: bold;
    padding: 5px;
    margin: 2px;
  }

  .left-radio-div {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .radio-input {
    width: 30px;
  }
  .radio-label {
    width: 30%;
  }
  .radio-select-div {
    width: 100%;
    display: flex;
    flex-direction: row;
  }

  .right-select-div {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3px;
  }

  select {
    width: 100px;
    margin-left: 10px;
  }

  .img-upload-label {
    display: flex;
    justify-content: center; /* 가로 정렬 */
    text-align: center;
    width: 100%;
  }
  .title {
    margin-top: 10px;
  }
`;
