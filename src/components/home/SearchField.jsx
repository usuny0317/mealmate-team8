import { FiSearch } from 'react-icons/fi';
import styled from 'styled-components';
export default function SearchField() {
  return (
    <StSearchFieldWrapper>
      <div className='inputBox'>
        <input type='text' placeholder='오늘 뭐 먹을까? 🤔' />
        <FiSearch className='searchIcon' size={22} />
      </div>
    </StSearchFieldWrapper>
  );
}

const StSearchFieldWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 8vh;
  .inputBox {
    background-color: #fff;
    border: 1px solid ${({ theme }) => theme.colors.bgDark};
    width: 60%;
    display: flex;
    align-items: center;
    border-radius: 5px;
    box-shadow: 1px 2px 1px #eaeaea;
    @media screen and (max-width: 500px) {
      width: 100%;
    }
  }
  .inputBox > input {
    width: calc(100% - 22px);
    padding: 20px 10px;
    margin-right: 5px;
    border: none;
  }
  .inputBox > input:focus {
    outline: none;
  }
  .searchIcon {
    width: fit-content;
    cursor: pointer;
    padding-right: 10px;
  }
`;
