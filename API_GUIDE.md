# 메모 앱 API 연동 가이드

이 문서는 메모 앱을 백엔드 API와 연동하는 방법을 설명합니다.

## API 명세

### 메모 API

| 메서드 | 경로 | 설명 | 요청 예시                                                                                                   | 응답 |
|--------|------|------|---------------------------------------------------------------------------------------------------------|------|
| POST | `/api/memos` | 메모 작성 | `{ "title": "JPA 공부", "author": "작성자", "content": "영속성 컨텍스트 정리", "updatedAt": "2025-04-01 hhmmss" }` | 201 Created |
| GET | `/api/memos` | 메모 목록 조회 | -                                                                                                       | 메모 리스트 |
| GET | `/api/memos/{id}` | 메모 상세 조회 | -                                                                                                       | 메모 상세 |
| PUT | `/api/memos/{id}` | 메모 수정 | `{ "title": "JPA 정리", "author": "작성자", "content": "flush 설명 추가", "updatedAt": "2025-04-01 hhmmss" }`                                    | 200 OK |
| DELETE | `/api/memos/{id}` | 메모 삭제 | -                                                                                                       | 204 No Content |

### 댓글 API

| 메서드 | 경로 | 설명 | 요청 예시                                                                                 | 응답 |
|--------|------|------|---------------------------------------------------------------------------------------|------|
| POST | `/api/memos/{memoId}/comments` | 댓글 작성 | `{ "author": "작성자", "content": "좋은 정리 감사합니다!", "updatedAt": "2025-04-01 hhmmss" }` | 201 Created |
| GET | `/api/memos/{memoId}/comments` | 댓글 목록 조회 | -                                                                                     | 댓글 리스트 |
| PUT | `/api/comments/{commentId}` | 댓글 수정 | `{ "author": "작성자", "content": "내용 수정합니다.", "updatedAt": "2025-04-01 hhmmss" }`                                       | 200 OK |
| DELETE | `/api/comments/{commentId}` | 댓글 삭제 | -                                                                                     | 204 No Content |

## API 서비스 사용법

프로젝트에서는 `src/api/memoService.js` 파일을 사용하여 실제 백엔드 API와 통신합니다.

```javascript
// 컴포넌트에서 API 서비스 import
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

백엔드 API의 기본 URL을 변경하려면 `src/api/memoService.js` 파일에서 `API_BASE_URL` 값을 수정하세요:

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