import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { main_select, get_sub_select } from '../constants/signUpSelector';
import { supabase } from '../supabase/client';

//회원가입페이지지
const Signup = () => {
  //값 보내주고 관리하기 위한 state
  //일단 작성하고 나중에 묶을까 생각 중입니다.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState(true);
  const [main_location, setMain_location] = useState('서울특별시');
  const [sub_location, setSub_location] = useState('');
  const [profile, setProfile] = useState(
    'https://www.icreta.com/files/attach/images/319/275/055/8e2c1590a474a9afb78c4cb23a9af5b2.jpg'
  );
  //셀렉트 박스 전용
  const mainselect = main_select;
  //select박스에서 두번째 인자 전용입니다!
  const [get_sub, setget_sub] = useState([]);

  //완료 후 로그인으로 보내 줄 navigate
  const navigate = useNavigate();

  //1. select Box useEffect
  useEffect(() => {
    //메인 비어있을 때 업데이트 null.map 오류 나지 않게..
    if (main_location) {
      setget_sub(get_sub_select(main_location));
    }
  }, [main_location]);

  const handleSignup = async (e) => {
    e.preventDefault();
    //회원가입을 하려니까 규칙이 있었다는 것 같아요.
    //유효성 검사를 추가했습니다.
    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해 주세요.');
      return;
    }

    if (password.length < 6) {
      alert('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    //수파 베이스 연결 시도하기기
    try {
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

      const { error: userErr } = await supabase.from('users').insert({
        id: authData.user.id,
        nick_name: nickname,
        gender,
        main_location,
        sub_location,
        profile,
      });
      if (userErr) throw userErr;

      //다혜님 alert로 바꾸기기
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (error) {
      alert(error.message);
      console.error('회원가입 오류:', error);
    }
  };

  return (
    <div>
      <div>로고 이미지 자리</div>
      <div>회원가입 타이틀 자리</div>
      <div>
        <form onSubmit={handleSignup}>
          <label>
            이메일:{' '}
            <input
              placeholder='이메일'
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
              required
              placeholder='닉네임'
              onChange={(e) => {
                setNickname(e.target.value);
              }}
            />
          </label>
          <label>
            성별:
            <label>
              남성
              <input
                type='radio'
                value={true}
                name='gender'
                onChange={() => {
                  setGender(true);
                }}
              />
            </label>
            <label>
              여성
              <input
                type='radio'
                value={false}
                name='gender'
                onChange={() => {
                  setGender(false);
                }}
              />
            </label>
          </label>
          <br />
          {
            //아래 지역부분을 component로 바꿔서 태진님이랑 공유하기
          }
          <label>
            지역:
            <select
              value={main_location}
              className='main_location'
              onChange={(e) => {
                const selectedValue = e.target.value;
                setMain_location(selectedValue);

                console.log(main_location);
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
          <label>
            프로필: <button>추가</button> <button>삭제</button>
          </label>
          <button type='submit'>가입하기</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
