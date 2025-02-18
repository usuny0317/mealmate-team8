# 🍽 함께 밥 먹을 사람 모집 프로젝트
## 배포링크
- https://mealmate-team8-git-main-usuny0317s-projects.vercel.app/

## 📌 프로젝트 소개
이 프로젝트는 함께 밥 먹을 사람을 모집하는 웹 애플리케이션입니다. 사용자는 모집 게시글을 작성하고, 다른 사용자들은 모집에 참여할 수 있습니다. 모집 인원이 가득 차면 자동으로 마감됩니다.
![Image](https://github.com/user-attachments/assets/19989c13-90a9-46b8-a2d2-8b75b525e2dd)

## 🛠 주요 기능

### 🔐 사용자 인증
- 회원가입 및 로그인 기능 제공
- 로그인 여부는 `sessionStorage`를 활용하여 관리

### 📢 게시글
- 모집 게시글 작성 가능
- `카카오 API`를 활용하여 위치 정보 표시
- 이미지를 포함하여 업로드
- 참여하기가 다 차면 접근 막기

### 📄 상세 페이지
- 자신이 작성한 게시글 수정 및 삭제 가능
- 댓글 작성 및 모집 참여 가능

### 🏠 마이페이지
- 자신이 작성한 게시글 확인 가능
- 자신이 참여한 게시글 확인 가능
- 프로필 정보 변경 가능

### 🔍 탐색 기능
- 페이지네이션 지원
- `메뉴 / 작성자 / 정보` 기준으로 필터링 가능
- 특정 유저의 프로필 이미지를 클릭하면 해당 사용자가 작성한 게시글 목록을 확인 가능

## 💾 데이터 저장소
- `Supabase`를 활용하여 게시글 및 사용자 데이터 저장
- `Supabase Storage`를 이용해 이미지 저장

## 🛠 사용한 라이브러리
- ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white) **@supabase/supabase-js** - Supabase API 연동 (데이터베이스)
- ![Day.js](https://img.shields.io/badge/Day.js-FF4500?logo=javascript&logoColor=white) **dayjs** - 날짜 및 시간 포맷 처리
- ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white) **react** - React 라이브러리
- ![React DOM](https://img.shields.io/badge/React%20DOM-61DAFB?logo=react&logoColor=white) **react-dom** - React DOM 조작
- ![React Icons](https://img.shields.io/badge/React%20Icons-E91E63?logo=react&logoColor=white) **react-icons** - 아이콘 라이브러리
- ![Kakao](https://img.shields.io/badge/Kakao%20Maps-FFCD00?logo=kakao&logoColor=black) **react-kakao-maps-sdk** - 카카오 지도 API
- ![React Router](https://img.shields.io/badge/React%20Router-CA4245?logo=reactrouter&logoColor=white) **react-router-dom** - 페이지 라우팅
- ![Styled Components](https://img.shields.io/badge/Styled%20Components-DB7093?logo=styledcomponents&logoColor=white) **styled-components** - 스타일링 라이브러리
- ![SweetAlert2](https://img.shields.io/badge/SweetAlert2-FF2D20?logo=javascript&logoColor=white) **sweetalert2** - 팝업 알림



## 🚀 실행 방법
1. 프로젝트 클론
   ```bash
   git clone https://github.com/usuny0317/mealmate-team8/
   ```
2. 패키지 설치
   ```bash
   yarn install
   ```
3. 환경 변수 설정 (`.env.local` 파일 생성)
   ```env
   REACT_APP_SUPABASE_URL=<YOUR_SUPABASE_URL>
   REACT_APP_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
   REACT_APP_KAKAO_API_KEY=<YOUR_KAKAO_API_KEY>
   ```
4. 프로젝트 실행
   ```bash
   yarn start
   ```

## 📌 추가 정보
- 프로젝트 개발 시 `React`와 `Supabase`를 활용하여 백엔드 서버 없이 간편하게 데이터를 관리하도록 설계되었습니다.
- UI 스타일링은 `styled-components`를 사용하였으며, 기본적인 레이아웃 리셋을 위해 `styled-reset`을 적용하였습니다.
- `SweetAlert2`를 활용하여 알림 및 경고 메시지를 보다 직관적으로 제공하였습니다.


## 📜 라이선스
이 프로젝트는 `MIT` 라이선스 하에 배포됩니다. 자유롭게 사용하고 기여할 수 있습니다. 🎉
