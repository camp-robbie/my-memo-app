import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './LoginForm.css';

const LoginForm = ({ onClose }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup } = useContext(AuthContext);

  // 이메일 유효성 검사
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 비밀번호 유효성 검사 (8자 이상, 대문자, 소문자, 숫자, 특수문자 포함)
  const isPasswordValid = (password) => {
    return password.length >= 8;
  };

  // 폼 유효성 검사
  const isFormValid = () => {
    if (!isEmailValid(email)) {
      setError('유효한 이메일 주소를 입력하세요.');
      return false;
    }

    if (!isPasswordValid(password)) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return false;
    }

    if (!isLoginMode && password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }

    setError('');
    return true;
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) return;
    
    setIsLoading(true);
    try {
      if (isLoginMode) {
        // 로그인 처리
        const result = await login(email, password);
        if (!result.success) {
          setError(result.message);
        } else if (onClose) {
          onClose();
        }
      } else {
        // 회원가입 처리
        const result = await signup(email, password);
        if (!result.success) {
          setError(result.message);
        } else if (onClose) {
          onClose();
        }
      }
    } catch (err) {
      setError('처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form-header">
        <h2>{isLoginMode ? '로그인' : '회원가입'}</h2>
        {onClose && (
          <button onClick={onClose} className="close-button" aria-label="닫기">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
      
      {error && <div className="auth-error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            placeholder="example@email.com"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            placeholder="비밀번호 (8자 이상)"
          />
        </div>
        
        {!isLoginMode && (
          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="비밀번호 확인"
            />
          </div>
        )}
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading 
            ? '처리 중...' 
            : isLoginMode 
              ? '로그인' 
              : '회원가입'
          }
        </button>
      </form>
      
      <div className="auth-mode-toggle">
        <button 
          onClick={() => setIsLoginMode(!isLoginMode)}
          className="toggle-auth-mode-button"
          disabled={isLoading}
        >
          {isLoginMode 
            ? '계정이 없으신가요? 회원가입하기' 
            : '이미 계정이 있으신가요? 로그인하기'
          }
        </button>
      </div>
    </div>
  );
};

export default LoginForm;