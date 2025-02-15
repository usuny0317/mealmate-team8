import Swal from 'sweetalert2';
import { ALERT_TYPE } from '../constants/alertConstant';

const { SUCCESS, WARNING, ERROR } = ALERT_TYPE;

export const alert = () => {
  const createAlert = (alertInfo) => {
    const { type, content, buttonText } = alertInfo;
    const alertType = {
      [ERROR]: {
        type: ERROR,
        title: 'Error!',
        content: content || '에러가 발생했습니다.',
        buttonText: buttonText || '확인',
        buttonColor: 'rgb(238, 76, 76)',
      },
      [SUCCESS]: {
        type: SUCCESS,
        title: 'Success!',
        content: content || '완료되었습니다.',
        buttonText: buttonText || '확인',
        buttonColor: 'rgb(133, 215, 92)',
      },
      [WARNING]: {
        type: WARNING,
        title: 'Warning!',
        content: content || '다시 확인해 주세요.',
        buttonText: buttonText || '확인',
        showCancelButton: true,
        buttonColor: 'rgb(245, 170, 104)',
      },
    };

    const alert = alertType[type] || alertType[SUCCESS];

    return Swal.fire({
      title: alert.title,
      text: alert.content,
      icon: alert.type,
      confirmButtonText: alert.buttonText,
      confirmButtonColor: alert.buttonColor,
      showCancelButton: alert.showCancelButton ?? null,
      cancelButtonText: '취소',
    });
  };

  return (alertInfo) => {
    return createAlert(alertInfo);
  };
};
