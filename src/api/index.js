/**
 * API 서비스 선택 모듈
 * 
 * 이 파일은 실제 API와 Mock API 중 하나를 선택하여 내보냅니다.
 * 환경 변수 VITE_API_MODE를 통해 API 모드를 설정할 수 있습니다.
 * - 'real': 실제 백엔드 API 연결
 * - 'mock': 로컬 Mock 데이터 사용
 */

import mockService from './mockService';
import memoService from './memoService';

// 환경 변수 확인 (기본값: mock)
const API_MODE = import.meta.env.VITE_API_MODE || 'mock';

// API 서비스 선택
const apiService = API_MODE === 'real' ? memoService : mockService;

console.log(`[API] Using ${API_MODE === 'real' ? 'real backend API' : 'mock data'} service`);

export default apiService;