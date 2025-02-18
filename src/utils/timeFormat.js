// serverDate 형식이 2025-02-22T12:00:00+00:00 이런 형식이어야함!!!
export const getFormatTime = (serverDate) => {
  const date = serverDate.split('T')[0];
  const time = serverDate.split('T')[1].slice(0, 5);

  return `${date} ${time}`;
};
