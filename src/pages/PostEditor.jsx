import styled from 'styled-components';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { alert } from '../utils/alert';
import { ALERT_TYPE } from '../constants/alertConstant';
import Swal from 'sweetalert2';

const PostEditor = () => {
  // 파일 최대 크기
  const MAX_FILE_SIZE = 50 * 1024 * 1024;
  const { SUCCESS, ERROR, WARNING } = ALERT_TYPE;
  const navigate = useNavigate();
  const alertConsole = alert();
  const MY_NICK_NAME = JSON.parse(
    sessionStorage.getItem('loggedInUser')
  ).nick_name;
  // 게시글 정보 상태
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: '',
    numberOfPeople: 1,
    location: '',
    file: null,
    menu: '',
  });

  const [imagePreview, setImagePreview] = useState(''); // 이미지 미리보기 상태
  const fileInputRef = useRef(null); // 파일 입력 필드 접근을 위한 ref
  const [position, setPosition] = useState({ lat: 37.5665, lng: 126.978 }); // 지도의 위치값 상태
  const postId = useParams(); // 가져올 게시글 ID

  // 게시글의 id와 일치한 데이터 가져오기
  const getPostById = async (postId) => {
    const { data, error } = await supabase
      .from('posts') // 테이블명
      .select('*') // 모든 컬럼 선택
      .eq('id', postId) // 특정 ID 값과 같은 row 가져오기
      .single(); // 단일 row만 가져오기

    if (error) {
      console.error('게시글 가져오기 실패:', error);
      return null;
    }

    return data; // 가져온 row 반환
  };

  useEffect(() => {
    if (!postId) return;

    const fetchPostData = async () => {
      const postData = await getPostById(postId);
      if (postData) {
        // 데이터 매핑
        setFormData({
          title: postData.post_title,
          content: postData.post_content,
          date: postData.meeting_date.replace(' ', 'T').split('+')[0],
          numberOfPeople: postData.post_rec_cnt,
          location: postData.post_location,
          menu: postData.post_menu,
          file: postData.post_img_url, // 파일은 새로 업로드해야 함
        });

        // 기존 이미지 미리보기 설정
        if (postData.post_img_url) {
          setImagePreview(postData.post_img_url);
        }
      }
    };

    fetchPostData();
  }, [postId]);

  // 엔터 키 눌림 방지 함수
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 엔터 키 기본 동작(폼 제출)을 막음
      searchAddress(formData.location); // 엔터 클릭시 검색 함수 실행
    }
  };

  // 직접 주소 검색 함수
  const searchAddress = useCallback(
    (inputAddress) => {
      const searchQuery = inputAddress?.trim() || formData.location.trim();
      const { kakao } = window;

      if (!searchQuery) {
        alert('주소를 입력해주세요!');
        return;
      }

      if (!kakao?.maps?.services) {
        console.error('Kakao Map API 로드 실패');
        return;
      }

      new kakao.maps.services.Geocoder().addressSearch(
        searchQuery,
        (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            setPosition({
              lat: +result[0].y,
              lng: +result[0].x,
              isPanTo: true,
            });
          } else {
            alertConsole({
              type: ERROR,
              content: `${searchQuery}에 대한 결과를 찾을 수 없습니다.<br/>정확한 주소를 입력하거나 검색을 이용해주세요.`,
            });
            setFormData(() => ({
              location: '',
            }));
          }
        }
      );
    },
    [formData.location, ERROR]
  );

  // 주소 검색창 핸들러
  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const address = data.roadAddress || data.jibunAddress;

        // 상태 업데이트와 동시에 검색 실행
        setFormData((prev) => ({
          ...prev,
          location: address,
        }));

        // 선택한 주소를 바로 전달하여 검색
        setTimeout(() => searchAddress(address), 0);
      },
    }).open();
  };

  // 입력 필드 핸들러
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value, // 최소값 1 유지
    }));
  };

  // 이미지 파일 변경 핸들러 수정
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      // 파일 선택 취소 시 기존 이미지 유지
      setFormData((prev) => ({ ...prev, file: prev.file }));
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      alertConsole({
        type: ERROR,
        content: '50MB 이하의 파일만 업로드 가능합니다.',
      });
      return;
    }

    setFormData((prev) => ({ ...prev, file: selectedFile }));
    if (selectedFile.type.startsWith('image/')) {
      const fileURL = URL.createObjectURL(selectedFile);
      setImagePreview(fileURL);
    }
  };

  // 게시글 입력값 리셋
  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      content: '',
      date: '',
      numberOfPeople: 1,
      location: '',
      file: null,
      menu: '',
    });
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  // 이미지 제거 핸들러
  const handleRemoveImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData((prev) => ({ ...prev, file: null }));
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 이미지 URL 메모리 해제
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // 입력시간 한국 시간으로 변경
  const getKoreanTime = () => {
    return new Date()
      .toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      .replace(/(\d{4})\. (\d{2})\. (\d{2})\.?/, '$1-$2-$3');
  };

  const cancleHandler = () => {
    alertConsole({
      type: WARNING,
      content: '정말로 취소 하시겠습니까?',
    }).then((result) => {
      if (result.isConfirmed) {
        // 승인 알림 표시
        Swal.fire('취소가 되었습니다.', '', 'success');
        navigate('/');
      }
    });
  };
  // 게시글 작성 클릭시 이벤트
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { title, content, date, numberOfPeople, location, file, menu } =
        formData;

      // 날짜 유효성 검증
      if (new Date(date).getTime() <= new Date().getTime()) {
        alertConsole({
          type: ERROR,
          content: '날짜는 현재 시간 이후여야 합니다.',
        });
        return;
      }

      // 스토리지 이미지 업로드
      let fileUrl = formData.file;
      // 새 파일이 업로드된 경우
      if (file instanceof File) {
        const fileExtension = file.name.split('.').pop();
        const filePath = `uploads/${Date.now()}.${fileExtension}`;

        // 기존 이미지 삭제 (이 부분을 새 파일 업로드 전으로 이동)
        if (typeof formData.file === 'string') {
          const oldFilePath = formData.file.split('/public/').pop();
          await supabase.storage
            .from('post-images')
            .remove([`public/${oldFilePath}`]);
        }

        // 새 이미지 업로드
        const { error } = await supabase.storage
          .from('post-images')
          .upload(`public/${filePath}`, file);

        if (error) throw error;
        fileUrl = getImageUrl(filePath);
      }
      // 파일 삭제된 경우 (이 조건문을 별도로 분리)
      else if (file === null) {
        // 기존 이미지 삭제
        if (typeof formData.file === 'string') {
          const oldFilePath = formData.file.split('/public/').pop();
          await supabase.storage
            .from('post-images')
            .remove([`public/${oldFilePath}`]);
        }
        fileUrl = null;
      }

      // 업로드 데이터
      const uploadData = {
        // ID 조건부 추가 (업데이트 시 필수)
        ...(postId && { id: postId }), // postId가 있으면 ID 필드 추가
        id: postId || undefined,
        post_title: title,
        post_content: content,
        post_location: location,
        post_rec_cnt: numberOfPeople,
        post_img_url: fileUrl,
        created_at: postId ? formData.created_at : getKoreanTime(), // 수정 시 기존 생성시간 유지
        updated_at: postId ? getKoreanTime() : null, // 수정 시 현재 시간으로 업데이트
        author_name: MY_NICK_NAME,
        meeting_date: date,
        post_menu: menu,
      };

      // 게시글 데이터 저장 (예: Supabase 데이터베이스에 저장)
      const { error: postError } = await supabase
        .from('posts')
        .upsert(uploadData);

      if (postError) {
        console.error('게시글 저장 실패:', postError);
        alertConsole({
          type: ERROR,
          content: '게시글 저장에 실패했습니다.',
        });
        return;
      }

      alertConsole({
        type: SUCCESS,
        content: '게시글이 성공적으로 작성되었습니다!',
      });

      resetForm();
      setImagePreview('');
      setPosition({ lat: 37.5665, lng: 126.978 });
    } catch (error) {
      console.error('게시글 작성 실패:', error);
    }
  };

  // 이미지 url 가져오기
  const getImageUrl = (imageName) => {
    return `${
      import.meta.env.VITE_APP_SUPABASE_URL
    }/storage/v1/object/public/post-images/public/${imageName}`;
  };

  // 모집인원 입력시 초기값 0을 제거
  function preventLeadingZero(input) {
    // 첫 번째 문자가 "0"이고 그 뒤에 다른 숫자가 있으면 "0" 제거
    if (input.value && input.value[0] === '0') {
      input.value = input.value.replace(/^0+(?=\d)/, ''); // 첫 번째 "0" 이후에 다른 숫자가 올 경우 "0"을 제거
    }
  }

  useEffect(() => {
    if (formData.location) {
      searchAddress(formData.location);
    }
  }, [formData.location, searchAddress]);

  return (
    <StRoot>
      <StTitleContainer>
        <h2>게시글 작성</h2>
      </StTitleContainer>
      <StEditorWrapper>
        <StPostForm onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          <StInputGroup>
            <StLabel>
              제목
              <StInput
                type='text'
                name='title'
                placeholder='게시글 제목을 입력하세요'
                className='title-input'
                autoFocus
                value={formData.title}
                onChange={handleInputChange}
                maxLength={50}
                required
              />
            </StLabel>
          </StInputGroup>

          <StInputRow>
            <StLabel className='half-width'>
              날짜
              <StInput
                type='datetime-local'
                name='date'
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </StLabel>
            <StLabel className='half-width'>
              모집인원
              <StInput
                type='number'
                name='numberOfPeople'
                min='1'
                placeholder='인원수를 입력'
                value={formData.numberOfPeople}
                onChange={handleInputChange}
                required
                onInput={(event) => preventLeadingZero(event.target)}
              />
            </StLabel>
            <StLabel className='half-width'>
              메뉴
              <StInput
                type='text'
                name='menu'
                placeholder='메뉴를 입력하세요'
                className='menu-input'
                value={formData.menu}
                onChange={handleInputChange}
                required
              />
            </StLabel>
          </StInputRow>
          <StInputRow>
            <StLabel className='full-width'>
              내용
              <StTextArea
                name='content'
                placeholder='게시글 내용을 상세히 입력하세요'
                rows={8}
                value={formData.content}
                onChange={handleInputChange}
                required
              />
            </StLabel>
          </StInputRow>

          <StInputRow>
            <StLabel className='half-width'>
              장소
              <StInputButtonContainer>
                <StInput
                  type='text'
                  name='location'
                  placeholder='"예) 서울특별시 강남구 테헤란로 427"'
                  value={formData.location}
                  onChange={handleInputChange}
                  onBlur={() => searchAddress()}
                  required
                />
                <StSearchButton type='button' onClick={handleAddressSearch}>
                  검색
                </StSearchButton>
              </StInputButtonContainer>
              <StMapContainer>
                <Map
                  center={position}
                  isPanto={position.isPanTo}
                  style={{ width: '100%', height: '100%' }}
                  level={3}
                >
                  <MapMarker position={position} />
                </Map>
              </StMapContainer>
            </StLabel>
            <StLabel className='half-width'>
              이미지 추가
              <StFileUploadWrapper>
                <StFileUploadLabel htmlFor='inputFile'>
                  클릭하여 이미지 선택
                  <StInput
                    type='file'
                    id='inputFile'
                    accept='image/*'
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </StFileUploadLabel>
              </StFileUploadWrapper>
              <StImagePreview>
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt='이미지 미리보기' />
                    <StRemoveButton onClick={handleRemoveImage}>
                      ×
                    </StRemoveButton>
                  </>
                ) : (
                  <StPlaceholderText>
                    <svg
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                    >
                      <path d='M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z' />
                      <path d='M17 21v-8H7v8M12 7v6M9 10h6' />
                    </svg>
                    <div>이미지 미리보기 영역</div>
                  </StPlaceholderText>
                )}
              </StImagePreview>
            </StLabel>
          </StInputRow>
          <StButtonGroup>
            <StButton type='submit'>작성 완료</StButton>
            <div>
              <StButton
                type='button'
                onClick={cancleHandler}
                className='cancel'
              >
                취소하기
              </StButton>
            </div>
          </StButtonGroup>
        </StPostForm>
      </StEditorWrapper>
    </StRoot>
  );
};

// Styled Components
const StRoot = styled.div`
  width: 100%;
  overflow: hidden;
  background: #f5f7fb;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 0;
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

const StInputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const StInputRow = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.8rem;
    margin-bottom: 1rem;
  }
`;

const StLabel = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2d3748;
  gap: 10px;
  margin-top: 10px;

  &.half-width {
    flex: 1;
    min-width: 280px;

    @media (max-width: 600px) {
      min-width: 100%;
    }
  }

  &.full-width {
    width: 100%;
  }
`;

const StInput = styled.input`
  width: 100%;
  height: 48px;
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

const StFileUploadWrapper = styled.div`
  position: relative;
  height: 48px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  background: #f8fafc;
  transition: all 0.2s;
  margin-bottom: 0.5rem;

  &:hover {
    background: #f1f5f9;
  }
`;

const StFileUploadLabel = styled.label`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 1rem;
  color: #4a5568;
  cursor: pointer;
`;

const StTextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  resize: vertical;
  width: 100%;
  min-height: 150px;
  font-size: 1rem;
  line-height: 1.5;
  box-sizing: border-box; /* 추가 */

  @media (max-width: 480px) {
    min-height: 120px;
    padding: 0.65rem;
  }
`;

const StImagePreview = styled.div`
  width: 100%;
  height: 370px;
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: repeating-conic-gradient(#f0f0f0 0% 25%, white 0% 50%) 50% /
      20px 20px;
    max-width: 90%;
    max-height: 90%;
    object-fit: scale-down;
  }
`;

const StPlaceholderText = styled.div`
  text-align: center;
  color: #718096;
  padding: 1rem;
  z-index: 1;

  svg {
    width: 40px;
    height: 40px;
    margin-bottom: 0.5rem;
    stroke: #4299e1;
  }
`;

const StMapContainer = styled.div`
  width: 100%;
  height: 370px;
  margin-top: 0.5rem;
  background-color: #f0f0f0;
`;

const StButtonGroup = styled.div`
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

const StRemoveButton = styled.button`
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

const StInputButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

const StSearchButton = styled.button`
  padding: 0.5rem 1rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;

  &:hover {
    background: #3182ce;
  }
`;

export default PostEditor;
