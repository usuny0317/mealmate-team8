import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase/client';

const PostEditor = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: '',
    numberOfPeople: 1,
    location: '',
    file: null,
  });

  const [imagePreview, setImagePreview] = useState(''); // 이미지 미리보기 상태
  const fileInputRef = useRef(null); // 파일 입력 필드 접근을 위한 ref

  // 입력 필드 핸들러 (재사용 가능)
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value, // 최소값 1 유지
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase(); // 확장자 추출
      if (selectedFile.type !== 'image/jpeg' || fileExtension !== 'jpg') {
        alert('허용된 이미지 파일(.jpg)만 업로드 가능합니다.');
        return;
      }
      setFormData((prev) => ({ ...prev, file: selectedFile }));
      const fileURL = URL.createObjectURL(selectedFile);
      setImagePreview(fileURL);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation(); // remove 버튼 클릭 시 파일 선택창을 열지 않도록
    setFormData((prev) => ({ ...prev, file: null }));
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 이미지 URL 메모리 해제
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const getKoreanTime = () => {
    const options = {
      timeZone: 'Asia/Seoul',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

    const koreanTime = new Date().toLocaleString('ko-KR', options);

    const formattedDate = koreanTime
      .replace(/오전/g, 'AM')
      .replace(/오후/g, 'PM')
      .replace(/(\d{4})\.\s(\d{2})\.\s(\d{2})\./, '$1-$2-$3')
      .replace(/(\d{2}):(\d{2}):(\d{2})/, '$1:$2:$3'); // 24시간 형식으로 변환
    return formattedDate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { title, content, date, numberOfPeople, location, file } = formData;

      if (new Date(date).getTime() <= new Date().getTime()) {
        alert('날짜는 현재 시간 이후여야 합니다.');
        return;
      }

      // 이미지 업로드
      let fileUrl = '';
      if (file) {
        const fileExtension = file.name.split('.').pop();
        const filePath = `uploads/${Date.now()}.${fileExtension}`;

        // Supabase Storage에 이미지 업로드
        const { error } = await supabase.storage
          .from('post-images')
          .upload(`public/${filePath}`, file);

        if (error) {
          console.error('이미지 업로드 실패:', error);
          return;
        }

        fileUrl = getImageUrl(filePath); // 업로드된 파일 URL 저장
      }

      const formData2 = {
        post_title: title,
        post_content: content,
        post_location: location,
        post_rec_cnt: numberOfPeople,
        post_img_url: fileUrl,
        created_at: getKoreanTime(),
        updated_at: null,
        author_name: '장현빈',
        meeting_date: date,
      };

      // 게시글 데이터 저장 (예: Supabase 데이터베이스에 저장)
      const { error: postError } = await supabase
        .from('posts')
        .upsert(formData2);

      if (postError) {
        console.error('게시글 저장 실패:', postError);
        alert('게시글 저장에 실패했습니다.');
        return;
      }

      alert('게시글이 성공적으로 작성되었습니다!');

      // 폼 데이터 초기화
      setFormData({
        title: '',
        content: '',
        date: '',
        numberOfPeople: 1,
        location: '',
        file: null,
      });
      setImagePreview('');
    } catch (error) {
      console.error('게시글 작성 실패:', error);
    }
  };

  const getImageUrl = (imageName) => {
    return `${
      import.meta.env.VITE_APP_SUPABASE_URL
    }/storage/v1/object/public/post-images/public/${imageName}`;
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
                name='title'
                placeholder='게시글 제목을 입력하세요'
                className='title-input'
                value={formData.title} // 제목 입력값은 title 상태
                onChange={handleInputChange} // 변경 시 상태 업데이트
                maxLength={50}
                required // 필수 입력 필드로 설정
              />
            </StLabel>
          </InputGroup>

          <InputRow>
            <StLabel className='half-width'>
              날짜
              <StInput
                type='datetime-local'
                name='date'
                value={formData.date} // 날짜 입력값은 date 상태
                onChange={handleInputChange} // 변경 시 상태 업데이트
                required // 필수 입력 필드로 설정
              />
            </StLabel>
            <StLabel className='half-width'>
              모집인원
              <StInput
                type='number'
                name='numberOfPeople'
                min='1'
                placeholder='인원수를 입력'
                value={formData.numberOfPeople} // 모집인원 입력값은 numberOfPeople 상태
                onChange={handleInputChange} // 변경 시 상태 업데이트
                required // 필수 입력 필드로 설정
                onInput={(event) => preventLeadingZero(event.target)} //0이 중복되면 0을 제거
              />
            </StLabel>
          </InputRow>

          <StLabel>
            내용
            <StTextArea
              name='content'
              placeholder='게시글 내용을 상세히 입력하세요'
              rows={8}
              value={formData.content} // 내용 입력값은 content 상태
              onChange={handleInputChange} // 변경 시 상태 업데이트
              required // 필수 입력 필드로 설정
            />
          </StLabel>

          <InputRow>
            <StLabelPlace className='half-width'>
              장소
              <StInput
                type='text'
                name='location'
                placeholder='모임 장소 입력'
                value={formData.location} // 장소 입력값은 location 상태
                onChange={handleInputChange} // 변경 시 상태 업데이트
                required // 필수 입력 필드로 설정
              />
            </StLabelPlace>
            <StLabel className='half-width'>
              이미지 추가
              <FileUploadWrapper>
                <FileUploadLabel htmlFor='inputFile'>
                  클릭하여 이미지 선택
                  <StInput
                    type='file'
                    id='inputFile'
                    accept='image/*'
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </FileUploadLabel>
              </FileUploadWrapper>
              {imagePreview && (
                <ImagePreview>
                  <img src={imagePreview} alt='이미지 미리보기' />
                  <RemoveButton onClick={handleRemoveImage}>×</RemoveButton>
                </ImagePreview>
              )}
            </StLabel>
          </InputRow>

          <ButtonGroup>
            <StButton type='submit'>작성 완료</StButton>
            <Link
              to={'/'}
              onClick={(e) => {
                if (
                  !window.confirm(
                    '정말 취소하시겠습니까? 작성 중인 내용이 사라집니다.'
                  )
                ) {
                  e.preventDefault();
                }
              }}
            >
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

// Styled Components는 그대로 두고, 필요한 부분만 수정했습니다.

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
  height: 48px; // 고정 높이 추가
  padding: 0 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &::placeholder {
    color: #a0aec0;
  }

  &[type='file'] {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 48px;
    cursor: pointer;
  }

  &[type='date'] {
    min-width: 180px;
  }

  @media (max-width: 480px) {
    height: 44px;
    font-size: 0.875rem;
  }
`;

// 파일 업로드 영역 스타일 추가
const FileUploadWrapper = styled.div`
  position: relative;
  height: 48px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  background: #f8fafc;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
  }
`;

const FileUploadLabel = styled.label`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 1rem;
  color: #4a5568;
  cursor: pointer;
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

const RemoveButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

export default PostEditor;
