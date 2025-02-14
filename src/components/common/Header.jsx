import styled from 'styled-components';

export const Header = () => {
  return (
    <>
      <StHeaderWrapper>header</StHeaderWrapper>
    </>
  );
};

const StHeaderWrapper = styled.header`
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  background: black;
  color: white;
  position: fixed;
  top: 0;
  z-index: 1000;

  @media (max-width: 375px) {
    // 아이폰 12 Pro 너비(390px) 기준
    padding: 0 10px;
  }
`;
