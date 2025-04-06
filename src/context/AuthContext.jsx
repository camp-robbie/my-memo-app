import { createContext, useState, useEffect } from 'react';
import authService from '../api/authService';

// 인증 컨텍스트 생성
export const AuthContext = createContext();

// 인증 제공자 컴포넌트
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 앱 로드 시 사용자 정보 가져오기
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        setError(null);

        // 인증 상태가 있는 경우에만 사용자 정보 요청
        if (authService.isAuthenticated()) {
          try {
            const userData = await authService.getCurrentUser();
            setCurrentUser(userData);
            setIsAuthenticated(true);
          } catch (error) {
            console.error('사용자 정보 로드 중 오류:', error);
            // 세션이 유효하지 않으면 로그아웃
            await authService.logout();
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setError('인증 초기화 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 로그인 함수
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(email, password);
      
      // 로그인 성공 시 사용자 정보 갱신
      if (response && response.success) {
        const userData = await authService.getCurrentUser();
        setCurrentUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      }
      
      return { success: false, message: '로그인에 실패했습니다.' };
    } catch (err) {
      setError(err.response?.data?.message || '로그인 중 오류가 발생했습니다.');
      return { success: false, message: err.response?.data?.message || '로그인 중 오류가 발생했습니다.' };
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
    }
  };

  // 회원가입 함수
  const signup = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      await authService.signup(email, password);
      
      // 회원가입 성공 후 자동 로그인
      return await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
      return { success: false, message: err.response?.data?.message || '회원가입 중 오류가 발생했습니다.' };
    } finally {
      setLoading(false);
    }
  };

  // 비밀번호 변경 함수
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      await authService.changePassword(currentPassword, newPassword);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다.');
      return { success: false, message: err.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다.' };
    } finally {
      setLoading(false);
    }
  };

  // 회원 탈퇴 함수
  const deleteAccount = async (password) => {
    try {
      setLoading(true);
      setError(null);
      await authService.deleteAccount(password);
      setCurrentUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || '계정 삭제 중 오류가 발생했습니다.');
      return { success: false, message: err.response?.data?.message || '계정 삭제 중 오류가 발생했습니다.' };
    } finally {
      setLoading(false);
    }
  };

  // 컨텍스트 값 정의
  const contextValue = {
    currentUser,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    signup,
    changePassword,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
