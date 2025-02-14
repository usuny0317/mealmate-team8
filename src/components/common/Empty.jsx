import styled from 'styled-components';

export default function Empty() {
  return <StEmpty>데이터가 없습니다. 글을 등록해 주세요.</StEmpty>;
}

const StEmpty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
