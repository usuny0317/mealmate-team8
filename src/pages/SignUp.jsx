import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { main_select, get_sub_select } from '../constants/signUpSelector';

//회원가입페이지지
const Signup = () => {
  //값 보내주고 관리하기 위한 state
  //일단 작성하고 나중에 묶을까 생각 중입니다.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [main_location, setMain_location] = useState('서울특별시');
  const [sub_location, setSub_location] = useState([]);
  const [profile, setProfile] = useState('');
  const [gender, setGender] = useState(true);

  //셀렉트 박스 전용
  const mainselect = main_select;

  //완료 후 로그인으로 보내 줄 navigate
  const navigate = useNavigate();

  useEffect(() => {
    //메인 비어있을 때 업데이트 null.map 오류 나지 않게..
    if (main_location) {
      setSub_location(get_sub_select(main_location));
    }
    setSub_location(get_sub_select(main_location));
  }, [main_location]);

  const handleSignup = async (e) => {
    e.preventDefault();
    //아래는 수파 베이스 값 올려주시면 시도할 것.
    try {
      //수파 베이스 연결 시도하기기
      console.log(email + ' ' + password + ' ' + nickname + ' ' + gender);

      //추가 데이터 보내기
      //서버에서 auth 값(이메일, 비밀번호)을 받아오기
      /* const {data: authData, err: authErr}=await supabase.auth.signUp({
        email,
        password,
      }); 
      
       if (authError) throw authError;

        const { error: userError } = await supabase
        .from("users")
        .insert({ id: authData.user.id, nick_name: nickname, gender: gender, ... 이어 작성할 것것  });
      // 위의 방식이 맞는 지 아직 모름!

      //다혜님 alert로 바꾸기기
       alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (error) {
      alert(error.message);
      console.error("회원가입 오류:", error);
    }
      */
    } catch (err) {
      console.log(err);
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
                onChange={(e) => {
                  setGender(e.target.value);
                }}
              />
            </label>
            <label>
              여성
              <input
                type='radio'
                value={false}
                name='gender'
                onChange={(e) => {
                  setGender(e.target.value);
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
              className='main_location'
              onChange={(e) => {
                setMain_location(e.target.value);
              }}
            >
              {mainselect.map((main) => {
                return <option key={main}>{main}</option>;
              })}
            </select>
            <select className='sub_location'>
              {
                //배열인지 확인, 배열일 때만 동작하게 && 사용.
                //문제 발생!! 처음에 서울 눌렀을 때 안된다..
                Array.isArray(sub_location) &&
                  sub_location.map((sub) => {
                    return <option key={sub}>{sub}</option>;
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
