import axios from 'axios';

// API 기본 URL
const API_BASE_URL = '/api';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CORS 요청에 쿠키 포함 (세션 쿠키를 위해 필수)
});

// 응답 인터셉터 설정
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 401 Unauthorized 오류 처리 (세션 만료 등)
    if (error.response && error.response.status === 401) {
      // 세션이 만료되었을 때 처리
      localStorage.removeItem('isAuthenticated');
      // 현재 상태를 로컬 스토리지에 저장하고 로그인 화면으로 이동할 수 있음
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * 인증 서비스 API
 */
const authService = {
  // 회원가입
  signup: async (email, password) => {
    try {
      const response = await api.post('/signup', { email, password });
      return response;
    } catch (error) {
      console.error('회원가입 중 오류가 발생했습니다:', error);
      throw error;
    }
  },

  // 로그인
  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      // 세션 인증 성공 시 로컬 스토리지에 인증 상태 저장
      if (response && response.success) {
        localStorage.setItem('isAuthenticated', 'true');
      }
      return response;
    } catch (error) {
      console.error('로그인 중 오류가 발생했습니다:', error);
      throw error;
    }
  },

  // 로그아웃
  logout: async () => {
    try {
      // 서버에 로그아웃 요청 (세션 삭제)
      await api.post('/logout');
    } catch (error) {
      console.error('로그아웃 중 오류가 발생했습니다:', error);
    } finally {
      // 로컬 인증 상태 제거
      localStorage.removeItem('isAuthenticated');
    }
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async () => {
    try {
      return await api.get('/users/me');
    } catch (error) {
      console.error('사용자 정보를 가져오는 중 오류가 발생했습니다:', error);
      throw error;
    }
  },

  // 비밀번호 변경
  changePassword: async (currentPassword, newPassword) => {
    try {
      return await api.put('/users/password', { currentPassword, newPassword });
    } catch (error) {
      console.error('비밀번호 변경 중 오류가 발생했습니다:', error);
      throw error;
    }
  },

  // 회원 탈퇴
  deleteAccount: async (password) => {
    try {
      await api.delete('/users', { data: { password } });
      localStorage.removeItem('isAuthenticated');
      return { success: true };
    } catch (error) {
      console.error('계정 삭제 중 오류가 발생했습니다:', error);
      throw error;
    }
  },

  // 인증 상태 확인 (로그인 여부 확인)
  isAuthenticated: () => {
    return localStorage.getItem('isAuthenticated') === 'true';
  },
};

export default authService;