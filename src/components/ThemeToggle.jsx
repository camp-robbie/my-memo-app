import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  // 디버깅용 콘솔 로그 추가
  console.log('ThemeToggle 컴포넌트 렌더링 시작');
  
  try {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const isDark = theme === 'dark';
    
    console.log('현재 테마:', theme);
    
    return (
      <div className="theme-toggle-container">
        <span className="toggle-label">라이트</span>
        <label className="toggle-switch">
          <input 
            type="checkbox" 
            checked={isDark} 
            onChange={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          />
          <span className="toggle-slider">
            <span className="toggle-icon">
              {isDark ? (
                // 달 아이콘 (다크모드)
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                </svg>
              ) : (
                // 태양 아이콘 (라이트모드)
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4"></circle>
                  <path d="M12 2v2"></path>
                  <path d="M12 20v2"></path>
                  <path d="m4.93 4.93 1.41 1.41"></path>
                  <path d="m17.66 17.66 1.41 1.41"></path>
                  <path d="M2 12h2"></path>
                  <path d="M20 12h2"></path>
                  <path d="m6.34 17.66-1.41 1.41"></path>
                  <path d="m19.07 4.93-1.41 1.41"></path>
                </svg>
              )}
            </span>
          </span>
        </label>
        <span className="toggle-label">다크</span>
      </div>
    );
  } catch (error) {
    console.error('ThemeToggle 렌더링 중 오류 발생:', error);
    
    // 오류가 발생해도 최소한의 UI는 보여주기
    return (
      <div className="theme-toggle-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.8rem', color: '#666' }}>테마 토글 오류</span>
      </div>
    );
  }
};

export default ThemeToggle;