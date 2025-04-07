# 메모 앱 API 연동 가이드

이 문서는 메모 앱을 백엔드 API와 연동하는 방법을 설명합니다.

## 인증 방식

이 애플리케이션은 **세션 기반 인증**을 사용합니다. 인증 관련 주요 API 엔드포인트는 다음과 같습니다:

| 메서드 | 경로 | 설명 | 요청 예시 | 응답 |
|--------|------|------|----------|------|
| POST | `/api/signup` | 회원가입 | `{ "email": "user@example.com", "password": "password123" }` | `{ "success": true, "message": "회원가입이 완료되었습니다." }` |
| POST | `/api/login` | 로그인 | `{ "email": "user@example.com", "password": "password123" }` | `{ "success": true, "user": { ... } }` |
| POST | `/api/logout` | 로그아웃 | - | `{ "success": true }` |
| GET | `/api/users/me` | 현재 사용자 정보 조회 | - | 사용자 정보 |
| PUT | `/api/users/password` | 비밀번호 변경 | `{ "currentPassword": "이전비밀번호", "newPassword": "새비밀번호" }` | `{ "success": true }` |
| DELETE | `/api/users` | 회원 탈퇴 | `{ "password": "비밀번호" }` | `{ "success": true }` |

### 인증 방식 특징

- 세션 인증은 서버 측에서 사용자 세션을 관리합니다.
- 클라이언트는 세션 쿠키를 통해 인증 상태를 유지합니다.
- API 요청 시 `withCredentials: true` 설정으로 세션 쿠키가 자동으로 전송됩니다.

## 메모 API

| 메서드 | 경로 | 설명 | 요청 예시                                                                                  | 응답 |
|--------|------|------|----------------------------------------------------------------------------------------|------|
| POST | `/api/memos` | 메모 작성 | `{ "title": "JPA 공부", "content": "영속성 컨텍스트 정리", "updatedAt": "2025-04-01T12:34:56Z" }` | 201 Created |
| GET | `/api/memos` | 메모 목록 조회 | -                                                                                      | 메모 리스트 |
| GET | `/api/memos/{id}` | 메모 상세 조회 | -                                                                                      | 메모 상세 |
| PUT | `/api/memos/{id}` | 메모 수정 | `{ "title": "JPA 정리", "content": "flush 설명 추가", "updatedAt": "2025-04-01T12:34:56Z" }` | 200 OK |
| DELETE | `/api/memos/{id}` | 메모 삭제 | -                                                                                      | 204 No Content |

## 댓글 API

| 메서드 | 경로 | 설명 | 요청 예시 | 응답 |
|--------|------|------|----------|------|
| POST | `/api/memos/{memoId}/comments` | 댓글 작성 | `{"content": "좋은 정리 감사합니다!", "createdAt": "2025-04-01T12:34:56Z" }` | 201 Created |
| GET | `/api/memos/{memoId}/comments` | 댓글 목록 조회 | - | 댓글 리스트 |
| PUT | `/api/comments/{commentId}` | 댓글 수정 | `{ "content": "내용 수정합니다.", "updatedAt": "2025-04-01T12:34:56Z" }` | 200 OK |
| DELETE | `/api/comments/{commentId}` | 댓글 삭제 | - | 204 No Content |

## API 서비스 사용법

### 인증 서비스

```javascript
// 인증 서비스 import
import authService from '../api/authService';

// 로그인
const handleLogin = async (email, password) => {
  try {
    const response = await authService.login(email, password);
    if (response.success) {
      // 로그인 성공 처리
    }
  } catch (error) {
    // 오류 처리
  }
};

// 로그아웃
const handleLogout = async () => {
  try {
    await authService.logout();
    // 로그아웃 성공 처리
  } catch (error) {
    // 오류 처리
  }
};

// 인증 상태 확인
const isUserLoggedIn = authService.isAuthenticated();
```

### 메모 서비스

```javascript
// 메모 서비스 import
import apiService from '../api';

// 메모 목록 가져오기
const fetchMemos = async () => {
  try {
    const memos = await apiService.getAllMemos();
    // memos 데이터 처리
  } catch (error) {
    // 오류 처리
  }
};
```

## 백엔드 API 엔드포인트 설정

백엔드 API의 기본 URL을 변경하려면 `src/api/memoService.js` 및 `src/api/authService.js` 파일에서 `API_BASE_URL` 값을 수정하세요:

```javascript
// API 기본 URL 설정
const API_BASE_URL = '/api';  // 기본값
```

다른 서버를 사용하는 경우 전체 URL을 포함해야 합니다:

```javascript
const API_BASE_URL = 'https://api.example.com';
```

또는 환경 변수를 통해 설정할 수도 있습니다:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
```

그리고 `.env` 파일에 다음과 같이 설정합니다:

```
VITE_API_URL=https://api.example.com
```

## 중요 : CORS 및 세션 쿠키 설정

세션 기반 인증을 사용할 때 프론트엔드와 백엔드가 다른 도메인에서 실행되는 경우 CORS 설정이 중요합니다:

1. 백엔드 서버에서 다음 CORS 설정이 필요합니다:
   - `Access-Control-Allow-Credentials: true`
   - `Access-Control-Allow-Origin: [프론트엔드 도메인]` (와일드카드 `*` 사용 불가)
   - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
   - `Access-Control-Allow-Headers: Content-Type, ...`

2. 프론트엔드에서는 모든 HTTP 요청에 `withCredentials: true` 설정이 필요합니다.
   - 현재 앱에서는 이미 `axios` 인스턴스에 설정되어 있습니다.
