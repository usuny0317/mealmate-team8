//게시글 작성 및 수정페이지지
import styled from 'styled-components';

const PostEditor = () => {
  return (
    <StEditorWrapper>
      <StPostForm>
        <StLabel>
          제목
          <StInput type='text' placeholder='게시글 제목을 입력하세요' />
        </StLabel>
        <StLabel>
          내용
          <StTextArea placeholder='게시글 내용을 입력하세요' />
        </StLabel>
        <StLabel>
          장소
          <StInput type='text' placeholder='장소를 입력하세요' />
        </StLabel>
        <StLabel>
          날짜
          <StInput type='date' />
        </StLabel>
        <StLabel>
          모집인원
          <StInput type='number' />
        </StLabel>
        <StLabel>
          파일 첨부
          <StInput type='file' />
        </StLabel>
        <StButton type='submit'>게시글 작성</StButton>
      </StPostForm>
    </StEditorWrapper>
  );
};

export default PostEditor;

const StEditorWrapper = styled.div`
  max-width: 70%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const StPostForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StLabel = styled.label`
  width: 90%;
  margin-bottom: 10px;
  font-weight: bold;
  display: flex;
  flex-direction: column;
`;

const StInput = styled.input`
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const StTextArea = styled.textarea`
  height: 350px;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
`;

const StButton = styled.button`
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;
