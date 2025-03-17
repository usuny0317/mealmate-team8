import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { main_select, get_sub_select } from '../constants/signUpSelector';
import { supabase } from '../supabase/client';

import { alert } from '../utils/alert';
import { ALERT_TYPE } from '../constants/alertConstant';
import styled from 'styled-components';

const Signup = () => {
  // Image handling
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState('');
  const defalt_img = '/user2.png';

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState(true);
  const [main_location, setMain_location] = useState('서울특별시');
  const [sub_location, setSub_location] = useState('');
  const [profile, setProfile] = useState(null);
  const [check, setCheck] = useState(false);

  // Select options
  const mainselect = main_select;
  const [get_sub, setget_sub] = useState([]);

  const navigate = useNavigate();

  // Alert types
  const { SUCCESS, ERROR } = ALERT_TYPE;
  const SignupAlert = alert();

  // Update sub-location options when main location changes
  useEffect(() => {
    if (main_location) {
      setget_sub(get_sub_select(main_location));
      setSub_location(get_sub_select(main_location)[0]);
    }
  }, [main_location]);

  // Nickname duplication check
  const handleNickname = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('users').select('nick_name');
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

  // Signup handler
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      if (!check) throw '닉네임 중복 검사를 해주세요';
      else {
        // Register with email and password
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authErr) throw authErr;

        if (!authData || !authData.user) {
          throw new Error('회원가입 실패: 유저 정보가 없습니다.');
        }

        // Upload profile image
        let fileUrl = defalt_img;
        if (profile) {
          const fileExtension = profile.name.split('.').pop();
          const filePath = `upload/${Date.now()}.${fileExtension}`;

          const { error } = await supabase.storage
            .from('profile-images')
            .upload(`public/${filePath}`, profile);
          if (error) throw error;
          fileUrl = getImageUrl(filePath);
        } else {
          fileUrl = defalt_img;
        }

        // Insert user data
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

  // Image handlers
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setImagePreview(fileURL);
      setProfile(selectedFile);
    }
  };

  const handleDeletImg = (e) => {
    e.stopPropagation();
    setProfile('');
    setImagePreview('');
  };

  const getImageUrl = (imageName) => {
    return `${
      import.meta.env.VITE_APP_SUPABASE_URL
    }/storage/v1/object/public/profile-images/public/${imageName}`;
  };

  return (
    <StWrapper>
      <div className='content-container'>
        <div className='form-div'>
          <form onSubmit={handleSignup}>
            <div className='img-div'>
              <img src='/mm_logo.svg' alt='Logo' />
              <div className='title'>회원가입</div>
            </div>
            <div className='form-group'>
              <label>
                이메일
                <input
                  placeholder='이메일'
                  type='email'
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required
                />
              </label>
            </div>
            <div className='form-group'>
              <label>
                비밀번호
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
            </div>
            <div className='form-group nickname-group'>
              <label>
                닉네임
                <div className='nickname-input-container'>
                  <input
                    className='nickname-input'
                    required
                    placeholder='닉네임'
                    onChange={(e) => {
                      setNickname(e.target.value);
                    }}
                  />
                  <button
                    type='button'
                    onClick={handleNickname}
                    className='check-btn'
                  >
                    중복 검사
                  </button>
                </div>
              </label>
            </div>

            <div className='form-group location-gender-group'>
              <div className='gender-container'>
                <span className='label-text'>성별</span>
                <div className='radio-container'>
                  <label className='radio-label'>
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
                    남성
                  </label>
                  <label className='radio-label'>
                    <input
                      className='radio-input'
                      type='radio'
                      value={false}
                      name='gender'
                      onChange={() => {
                        setGender(false);
                      }}
                    />
                    여성
                  </label>
                </div>
              </div>

              <div className='location-container'>
                <span className='label-text'>지역</span>
                <div className='select-container'>
                  <select
                    value={main_location}
                    className='location-select'
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      setMain_location(selectedValue);
                    }}
                  >
                    {mainselect.map((main) => (
                      <option value={main} key={main}>
                        {main}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sub_location}
                    className='location-select'
                    onChange={(e) => {
                      setSub_location(e.target.value);
                    }}
                  >
                    {Array.isArray(get_sub) &&
                      get_sub.map((sub) => (
                        <option value={sub} key={sub}>
                          {sub}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            <div className='form-group profile-group'>
              <span className='label-text'>프로필</span>
              <div className='profile-content'>
                <div className='file-upload-container'>
                  <input
                    type='file'
                    id='inputFile'
                    accept='image/*'
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className='file-input'
                  />
                  <button
                    type='button'
                    onClick={handleDeletImg}
                    className='delete-img-btn'
                  >
                    이미지 삭제
                  </button>
                </div>
                {imagePreview && (
                  <div className='image-preview'>
                    <img src={imagePreview} alt='이미지 미리보기' />
                  </div>
                )}
              </div>
            </div>
            <button type='submit' className='submit-btn'>
              가입하기
            </button>
          </form>
        </div>
      </div>
    </StWrapper>
  );
};

export default Signup;

const StWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  overflow: auto; /* 내용이 많을 경우 스크롤 */

  .content-container {
    max-width: 500px;
    width: 100%;
    background: #ffffff;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    padding-bottom: 50px; /* 하단이 잘리지 않도록 여유 공간 */
  }

  .img-div {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 20px 0;
  }

  img {
    width: 100px;
    height: 100px;
  }

  .title {
    margin-top: 10px;
    font-size: 24px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.primaryLight};
  }

  .form-div {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  form {
    width: 100%;
    max-width: 600px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    font-size: 18px;
    gap: 20px;
    border-radius: 8px;
  }

  .form-group {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  label {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
    font-weight: 500;
  }

  input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
  }

  .nickname-group {
    margin-bottom: 10px;
  }

  .nickname-input-container {
    display: flex;
    gap: 10px;
    width: 100%;
  }

  .nickname-input {
    flex: 1;
  }

  .check-btn {
    width: 100px;
    white-space: nowrap;
  }

  .location-gender-group {
    display: flex;
    flex-direction: row;
    gap: 20px;
    width: 100%;
  }

  .gender-container,
  .location-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 50%;
  }

  .label-text {
    font-weight: 500;
  }

  .radio-container {
    display: flex;
    gap: 15px;
  }

  .radio-label {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
  }

  .radio-input {
    width: 20px;
    height: 20px;
  }

  .select-container {
    display: flex;
    gap: 10px;
  }

  .location-select {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    flex: 1;
  }

  .profile-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .profile-content {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .file-upload-container {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
  }

  .file-input {
    flex: 1;
  }

  .image-preview {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .image-preview img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
  }

  .delete-img-btn {
    white-space: nowrap;
  }

  button {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button:hover {
    opacity: 0.9;
  }

  .submit-btn {
    margin-top: 10px;
    padding: 12px;
    font-size: 18px;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .location-gender-group {
      flex-direction: column;
    }

    .gender-container,
    .location-container {
      width: 100%;
    }

    .nickname-input-container {
      flex-direction: column;
    }

    .check-btn {
      width: 100%;
    }

    .file-upload-container {
      flex-direction: column;
      align-items: flex-start;
    }

    .delete-img-btn {
      width: 100%;
    }

    form {
      padding: 15px;
    }
  }

  @media (max-width: 480px) {
    padding: 20px;

    .content-container {
      width: 100%;
    }

    form {
      border-width: 1px;
    }

    .select-container {
      flex-direction: column;
    }
  }
`;
