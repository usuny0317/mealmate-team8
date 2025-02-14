import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//회원가입페이지지
const Signup = () => {
  //값 보내주고 관리하기 위한 state
  //일단 작성하고 나중에 묶을까 생각 중입니다.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [main_location, setMain_location] = useState('');
  const [sub_location, setSub_location] = useState('');
  const [profile, setProfile] = useState('');
  const [gender, setGender] = useState(true);

  //완료 후 로그인으로 보내 줄 navigate
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    //아래는 수파 베이스 값 올려주시면 시도할 것.
    try {
      //수파 베이스 연결 시도하기기
      console.log(email + ' ' + password + ' ' + nickname);

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
                name='남자'
                onChange={() => {}}
              />
            </label>
            <label>
              여성
              <input
                type='radio'
                value={false}
                name='여성'
                onChange={() => {}}
              />
            </label>
          </label>
          <label>
            지역: <input onChange={() => {}} />
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
