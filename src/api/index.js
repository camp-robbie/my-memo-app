/**
 * API 서비스 모듈
 * 
 * 이 파일은 실제 백엔드 API와 연결하는 memoService를 내보냅니다.
 */

import memoService from './memoService';

// 항상 실제 API 서비스 사용
console.log('[API] Using real backend API service');

export default memoService;