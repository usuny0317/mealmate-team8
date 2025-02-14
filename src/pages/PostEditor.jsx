import styled from 'styled-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const PostEditor = () => {
  const [title, setTitle] = useState(''); // 제목 상태
  const [content, setContent] = useState(''); // 내용 상태
  const [date, setDate] = useState(''); // 날짜 상태
  const [numberOfPeople, setNumberOfPeople] = useState(1); // 모집인원 상태, 최소값 1
  const [location, setLocation] = useState(''); // 장소 상태
  const [file, setFile] = useState(null); // 파일 첨부 상태
  const [imagePreview, setImagePreview] = useState(''); // 이미지 미리보기 상태

  // 각 입력 필드에서 값이 변경될 때 상태 업데이트
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);
  const handleDateChange = (e) => setDate(e.target.value);
  const handleNumberOfPeopleChange = (e) =>
    setNumberOfPeople(Number(e.target.value));
  const handleLocationChange = (e) => setLocation(e.target.value);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; // 선택한 파일
    setFile(selectedFile); // 상태 업데이트
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const fileURL = URL.createObjectURL(selectedFile); // 이미지 미리보기 URL 생성
      setImagePreview(fileURL); // 이미지 미리보기 상태 업데이트
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 폼 제출 동작을 방지

    // 유효성 검증
    if (!title || !content || !date || !location) {
      alert('모든 필드를 채워주세요!');
      return;
    }

    if (numberOfPeople < 1) {
      alert('모집인원은 1명 이상이어야 합니다.');
      return;
    }

    if (new Date(date) < new Date()) {
      alert('날짜는 현재 시간 이후여야 합니다.');
      return;
    }

    // 폼 데이터 확인 (콘솔에 출력)
    console.log('제목:', title);
    console.log('내용:', content);
    console.log('날짜:', date);
    console.log('모집인원:', numberOfPeople);
    console.log('장소:', location);
    console.log('파일:', file);
  };

  function preventLeadingZero(input) {
    // 첫 번째 문자가 "0"이고 그 뒤에 다른 숫자가 있으면 "0" 제거
    if (input.value && input.value[0] === '0') {
      input.value = input.value.replace(/^0+(?=\d)/, ''); // 첫 번째 "0" 이후에 다른 숫자가 올 경우 "0"을 제거
    }
  }

  return (
    <Root>
      <StTitleContainer>
        <h2>게시글 작성</h2>
      </StTitleContainer>
      <StEditorWrapper>
        <StPostForm onSubmit={handleSubmit}>
          <InputGroup>
            <StLabel>
              제목
              <StInput
                type='text'
                placeholder='게시글 제목을 입력하세요'
                className='title-input'
                value={title} // 제목 입력값은 title 상태
                onChange={handleTitleChange} // 변경 시 상태 업데이트
                required // 필수 입력 필드로 설정
              />
            </StLabel>
          </InputGroup>

          <InputRow>
            <StLabel className='half-width'>
              날짜
              <StInput
                type='datetime-local'
                value={date} // 날짜 입력값은 date 상태
                onChange={handleDateChange} // 변경 시 상태 업데이트
                required // 필수 입력 필드로 설정
              />
            </StLabel>
            <StLabel className='half-width'>
              모집인원
              <StInput
                type='number'
                min='1'
                placeholder='인원수를 입력'
                value={numberOfPeople} // 모집인원 입력값은 numberOfPeople 상태
                onChange={handleNumberOfPeopleChange} // 변경 시 상태 업데이트
                required // 필수 입력 필드로 설정
                onInput={(event) => preventLeadingZero(event.target)} //0이 중복되면 0을 제거
              />
            </StLabel>
          </InputRow>

          <StLabel>
            내용
            <StTextArea
              placeholder='게시글 내용을 상세히 입력하세요'
              rows={8}
              value={content} // 내용 입력값은 content 상태
              onChange={handleContentChange} // 변경 시 상태 업데이트
              required // 필수 입력 필드로 설정
            />
          </StLabel>

          <InputRow>
            <StLabelPlace className='half-width'>
              장소
              <StInput
                type='text'
                placeholder='모임 장소 입력'
                value={location} // 장소 입력값은 location 상태
                onChange={handleLocationChange} // 변경 시 상태 업데이트
                required // 필수 입력 필드로 설정
              />
            </StLabelPlace>
            <StLabel className='half-width'>
              이미지 추가
              <StInput
                type='file'
                id='inputFile'
                accept='image/*'
                onChange={handleFileChange}
              />
              {/* 이미지 미리보기 표시 */}
              {imagePreview && (
                <ImagePreview>
                  <img src={imagePreview} alt='이미지 미리보기' />
                </ImagePreview>
              )}
            </StLabel>
          </InputRow>

          <ButtonGroup>
            <StButton type='submit'>작성 완료</StButton>
            <Link to={'/Home'}>
              <StButton type='button' className='cancel'>
                취소하기
              </StButton>
            </Link>
          </ButtonGroup>
        </StPostForm>
      </StEditorWrapper>
    </Root>
  );
};

// Styled Components
const Root = styled.div`
  width: 100%;
  overflow: hidden; /* 세로 스크롤 숨기기 */
  background: #f5f7fb;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 0; /* 불필요한 여백 제거 */
`;

const StTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  width: 100%;
  text-align: center;

  h2 {
    font-size: 2rem;
    font-weight: bold;
    color: #2d3748;
    margin: 0;
  }

  @media (max-width: 480px) {
    min-height: 40px;

    h2 {
      font-size: 1.5rem;
    }
  }
`;

const StEditorWrapper = styled.div`
  max-width: 1400px;
  width: calc(100% - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: calc(100% - 40px);
  }
`;

const StPostForm = styled.form`
  background: white;
  width: 100%;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;

  @media (max-width: 480px) {
    padding: 1.5rem;
    margin: 1rem 0;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const InputRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.8rem;
    margin-bottom: 1rem;
  }
`;

const StLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2d3748;

  &.half-width {
    flex: 1;
    min-width: 280px;

    @media (max-width: 600px) {
      min-width: 100%;
    }
  }
`;

const StInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &[type='date'] {
    min-width: 180px;
  }

  @media (max-width: 480px) {
    padding: 0.65rem;
    font-size: 0.875rem;
  }
`;

const StLabelPlace = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2d3748;

  &.half-width {
    flex: 1;
    min-width: 280px;

    @media (max-width: 600px) {
      min-width: 100%;
    }
  }
`;

const StTextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  resize: vertical;
  min-height: 150px;
  font-size: 1rem;
  line-height: 1.5;

  @media (max-width: 480px) {
    min-height: 120px;
    padding: 0.65rem;
  }
`;

const ImagePreview = styled.div`
  margin-top: 1rem;
  width: 100%; /* 부모 요소에 맞춰 100% 너비로 꽉 차게 설정 */
  position: relative;
  padding-top: 56.25%; /* 비율 16:9 (높이/너비 = 9/16 = 0.5625) */
  overflow: hidden;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover; /* 비율을 유지하면서 이미지가 영역을 꽉 채우도록 설정 */
    border-radius: 6px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.8rem;
    margin-top: 1.5rem;
  }
`;

const StButton = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
  }

  &[type='submit'] {
    background: #4299e1;
    color: white;
  }

  &.cancel {
    background: #e2e8f0;
    color: #2d3748;
  }
`;

export default PostEditor;
