import { ALERT_TYPE } from '../constants/alertConstant';
import { alert } from '../utils/alert';

//메인 페이지
const Home = () => {
  const { SUCCESS, ERROR, WARNING } = ALERT_TYPE;
  const successAlert = alert();
  const errorAlert = alert();
  const warningAlert = alert();

  return (
    <div>
      Home
      <button
        onClick={() => successAlert({ type: SUCCESS, content: 'ㅊㅋㅊㅋ' })}
      >
        성공
      </button>
      <button
        onClick={() =>
          errorAlert({ type: ERROR, content: 'ㄴㄴ', buttonText: '닫기' })
        }
      >
        실패
      </button>
      <button
        onClick={() =>
          warningAlert({ type: WARNING, content: '~를 삭제하시겠습니까?' })
        }
      >
        경고
      </button>
    </div>
  );
};

export default Home;
