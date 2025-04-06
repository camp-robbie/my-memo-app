import axios from 'axios';

// API 기본 URL
const API_BASE_URL = '/api';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// JWT 토큰 관리
const AUTH_TOKEN_KEY = 'auth_token';

// 로컬 스토리지에서 토큰 가져오기
const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

// 로컬 스토리지에 토큰 저장
const setToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

// 요청 인터셉터 설정 (요청 시 토큰 첨부)
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 설정
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 401 Unauthorized 오류 처리 (토큰 만료 등)
    if (error.response && error.response.status === 401) {
      // 토큰 제거 및 로그인 페이지로 리다이렉트
      setToken(null);
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
      // JWT 토큰을 로컬 스토리지에 저장
      if (response && response.token) {
        setToken(response.token);
      }
      return response;
    } catch (error) {
      console.error('로그인 중 오류가 발생했습니다:', error);
      throw error;
    }
  },

  // 로그아웃
  logout: () => {
    setToken(null);
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
      setToken(null);
      return { success: true };
    } catch (error) {
      console.error('계정 삭제 중 오류가 발생했습니다:', error);
      throw error;
    }
  },

  // 토큰 확인 (로그인 여부 확인)
  isAuthenticated: () => {
    return !!getToken();
  },

  // 토큰 가져오기
  getToken,
};

export default authService;