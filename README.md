# 메모 앱 (Memo App)

React로 개발된 간단한 메모 및 댓글 관리 애플리케이션입니다.

## 기능

- 메모 생성, 조회, 수정, 삭제 기능
- 메모에 댓글 작성, 수정, 삭제 기능
- 로컬 스토리지를 활용한 데이터 영속성

## 컴포넌트 구조

- **App**: 메인 애플리케이션 컴포넌트
- **메모 관련 컴포넌트**:
  - `Memo`: 메모 표시 및 편집 기능
- **댓글 관련 컴포넌트**:
  - `Comments`: 댓글 목록 관리
  - `CommentItem`: 개별 댓글 표시, 수정, 삭제
  - `CommentForm`: 댓글 작성 폼

## 기술 스택

- React 19
- Vite
- CSS (모듈화된 CSS 파일 구조)
- 로컬 스토리지 (가상 API 서비스)

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 린트 검사
npm run lint
```

## 프로젝트 구조

```
my-memo-app/
├── public/
├── src/
│   ├── api/
│   │   └── memoService.js    # 가상 API 서비스
│   ├── components/
│   │   ├── memo/             # 메모 관련 컴포넌트
│   │   │   ├── Memo.jsx
│   │   │   └── Memo.css
│   │   └── comment/          # 댓글 관련 컴포넌트
│   │       ├── Comments.jsx
│   │       ├── Comments.css
│   │       ├── CommentItem.jsx
│   │       ├── CommentItem.css
│   │       ├── CommentForm.jsx
│   │       └── CommentForm.css
│   ├── App.jsx               # 메인 앱 컴포넌트
│   ├── App.css               # 앱 스타일
│   ├── main.jsx              # 진입점
│   └── index.css             # 글로벌 스타일
├── package.json
└── vite.config.js
```

## 라이선스

MIT 라이선스