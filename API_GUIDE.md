# 메모 앱 API 연동 가이드

이 문서는 메모 앱을 백엔드 API와 연동하는 방법을 설명합니다.

## API 명세

### 메모 API

| 메서드 | 경로 | 설명 | 요청 예시 | 응답 |
|--------|------|------|-----------|------|
| POST | `/api/memos` | 메모 작성 | `{ "title": "JPA 공부", "content": "영속성 컨텍스트 정리" }` | 201 Created |
| GET | `/api/memos` | 메모 목록 조회 | - | 메모 리스트 |
| GET | `/api/memos/{id}` | 메모 상세 조회 | - | 메모 상세 |
| PUT | `/api/memos/{id}` | 메모 수정 | `{ "title": "JPA 정리", "content": "flush 설명 추가" }` | 200 OK |
| DELETE | `/api/memos/{id}` | 메모 삭제 | - | 204 No Content |

### 댓글 API

| 메서드 | 경로 | 설명 | 요청 예시 | 응답 |
|--------|------|------|-----------|------|
| POST | `/api/memos/{memoId}/comments` | 댓글 작성 | `{ "content": "좋은 정리 감사합니다!" }` | 201 Created |
| GET | `/api/memos/{memoId}/comments` | 댓글 목록 조회 | - | 댓글 리스트 |
| PUT | `/api/comments/{commentId}` | 댓글 수정 | `{ "content": "내용 수정합니다." }` | 200 OK |
| DELETE | `/api/comments/{commentId}` | 댓글 삭제 | - | 204 No Content |

## API 서비스 사용법

### 실제 백엔드 API 연동

프로젝트에서는 `src/api/memoService.js` 파일을 사용하여 실제 백엔드 API와 통신합니다.

```javascript
// 컴포넌트에서 API 서비스 import
import memoService from '../api/memoService';

// 메모 목록 가져오기
const fetchMemos = async () => {
  try {
    const memos = await memoService.getAllMemos();
    // memos 데이터 처리
  } catch (error) {
    // 오류 처리
  }
};
```

### Mock 서비스 사용하기

백엔드 API가 준비되지 않았거나 개발 중일 때는 `mockService.js`를 대신 사용할 수 있습니다.

**mockService 적용 방법:**

1. `src/api/index.js` 파일을 만들고 다음 코드를 추가합니다:

```javascript
// 개발 환경에서는 mockService, 프로덕션 환경에서는 실제 memoService 사용
import mockService from './mockService';
import realService from './memoService';

// 환경 변수로 분기 처리 (개발 환경 확인)
const API_MODE = import.meta.env.VITE_API_MODE || 'mock';

const apiService = API_MODE === 'mock' ? mockService : realService;

export default apiService;
```

2. 모든 컴포넌트에서 import 경로를 변경합니다:

```javascript
// 변경 전:
import memoService from '../api/memoService';

// 변경 후:
import apiService from '../api';
```

3. `.env` 또는 `.env.development` 파일에 환경 변수를 설정합니다:

```
VITE_API_MODE=mock  # mock 사용
# VITE_API_MODE=real  # 실제 API 사용
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