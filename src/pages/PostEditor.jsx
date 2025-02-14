import styled from 'styled-components';
import { Header } from '../components/common/Header';

const PostEditor = () => {
  return (
    <Root>
      <Header />
      <StTitleContainer>
        <h2>게시글 작성</h2>
      </StTitleContainer>
      <StEditorWrapper>
        <StPostForm>
          <InputGroup>
            <StLabel>
              제목
              <StInput
                type='text'
                placeholder='게시글 제목을 입력하세요'
                className='title-input'
              />
            </StLabel>
          </InputGroup>

          <InputRow>
            <StLabel className='half-width'>
              날짜
              <StInput type='datetime-local' />
            </StLabel>
            <StLabel className='half-width'>
              모집인원
              <StInput type='number' min='1' placeholder='인원수를 입력' />
            </StLabel>
          </InputRow>

          <StLabel>
            내용
            <StTextArea
              placeholder='게시글 내용을 상세히 입력하세요'
              rows={8}
            />
          </StLabel>

          <InputRow>
            <StLabel className='half-width'>
              장소
              <StInput type='text' placeholder='모임 장소 입력' />
            </StLabel>
            <StLabel className='half-width'>
              파일 첨부
              <StInput type='file' />
            </StLabel>
          </InputRow>

          <ButtonGroup>
            <StButton type='submit'>작성 완료</StButton>
            <StButton type='button' className='cancel'>
              취소하기
            </StButton>
          </ButtonGroup>
        </StPostForm>
      </StEditorWrapper>
    </Root>
  );
};

// Styled Components
const Root = styled.div`
  width: 100%;
  overflow: hidden;
  background: #f5f7fb;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 70px;
  box-sizing: border-box;
`;

const StTitleContainer = styled.div`
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: center; /* 가로 중앙 정렬 */
  min-height: 80px; /* 헤더와 폼 사이 일정한 공간 유지 */
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
  width: calc(100% - 80px); /* 좌우 패딩 포함한 너비 */
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box; /* 패딩 포함하여 크기 조정 */

  @media (max-width: 768px) {
    width: calc(100% - 40px); /* 모바일에서는 좌우 여백 줄임 */
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

// InputRow 미디어쿼리 강화
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
    min-width: 280px; // 최소 너비 추가

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
  box-sizing: border-box; // 추가

  &[type='date'] {
    min-width: 180px; // 날짜 입력 필드 최소 너비 설정
  }

  @media (max-width: 480px) {
    padding: 0.65rem;
    font-size: 0.875rem;
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
