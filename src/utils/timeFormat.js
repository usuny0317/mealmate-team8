// serverDate 형식이 2025-02-22T12:00:00+00:00 이런 형식이어야 하고 이미 로컬 타임이 적용되어 있어야 함!
export const getFormatDateTime = (serverDate) => {
  const date = serverDate.split('T')[0];
  const time = serverDate.split('T')[1].slice(0, 5);

  return `${date} ${time}`;
};

//serverDate가 2025-02-22T12:00:00+00:00 이런 형식이어야 하고 이미 로컬 타임이 적용되어 있어야 함!
export const getFormatDate = (serverDate) => {
  const date = new Date(serverDate); // 서버에서 받은 날짜

  // UTC 시간을 직접 가져오기
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // 월 (0부터 시작하므로 +1)
  const day = date.getUTCDate();

  return `${year}년 ${month}월 ${day}일`;
};

//serverDate가 2025-02-22T12:00:00+00:00 이런 형식이어야 하고 이미 로컬 타임이 적용되어 있어야 함!
export const getFormatTime = (serverDate) => {
  const date = new Date(serverDate); // 서버에서 받은 날짜

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  return `${hours}시 ${minutes}분`;
};
