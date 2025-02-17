import { useMemo, useRef, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import styled from 'styled-components';

// category에 따라 placeholder를 바꿔줌
const getPlaceholder = (category) => {
  switch (category) {
    case 'post_location':
      return '오늘은 어디에서 먹을까? 🤔';
    case 'author_name':
      return '오늘은 누구랑 먹을까? 🥰';
    default:
      return '오늘은 뭘 먹을까? 😆';
  }
};

const categoryOptions = [
  {
    name: '메뉴',
    value: '', //@TODO: 추가해야함
  },
  {
    name: '장소',
    value: 'post_location',
  },
  {
    name: '작성자',
    value: 'author_name',
  },
];

export default function SearchField({ setSearchField, setPage }) {
  const searchText = useRef(''); // 검색 텍스트(input)
  const [category, setCategory] = useState(''); // 검색 기준 (selectBox)
  const placeholder = useMemo(() => getPlaceholder(category), [category]); // placeholder 문구

  const handleSearch = () => {
    setSearchField({
      searchCategory: category,
      searchText: searchText.current,
    });
    setPage(1);
  };

  return (
    <StSearchFieldWrapper>
      {/* TODO: select부분은 추후에 리팩토링을 좀 할 수도 있습니다..  */}
      <select
        className='inputDefault selectBox'
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categoryOptions.map((option) => (
          <option key={`category_${option.value}`} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
      <div className='inputDefault inputBox'>
        <input
          type='text'
          placeholder={placeholder}
          autoFocus={true}
          onChange={(e) => (searchText.current = e.target.value)}
          onKeyDown={(e) => (e.key === 'Enter' ? handleSearch() : null)}
        />
        <FiSearch className='searchIcon' size={22} onClick={handleSearch} />
      </div>
    </StSearchFieldWrapper>
  );
}

const StSearchFieldWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4vh;
  .inputDefault {
    border-radius: 5px;
    border: 1px solid ${({ theme }) => theme.colors.bgDark};
    background-color: #fff;
    box-shadow: 1px 2px 1px #eaeaea;
  }

  .selectBox {
    padding: 20px 10px;
    box-sizing: border-box;
    /* appearance: none; */
    margin-right: 10px;
  }

  .inputBox {
    width: 60%;
    display: flex;
    align-items: center;

    @media screen and (max-width: 500px) {
      width: 80%;
      .selectBox {
        width: 20%;
      }
    }
  }
  .inputBox > input {
    width: calc(100% - 22px);
    padding: 20px 10px;
    margin-right: 5px;
    border: none;
    font-size: 1rem;
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
