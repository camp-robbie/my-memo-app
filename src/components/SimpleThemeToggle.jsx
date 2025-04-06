import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './SimpleThemeToggle.css';

// 간단한 버튼 형태의 테마 토글
const SimpleThemeToggle = () => {
  try {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const isDark = theme === 'dark';
    
    return (
      <button 
        className="simple-theme-toggle" 
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? '🌞 라이트 모드로 전환' : '🌙 다크 모드로 전환'}
      </button>
    );
  } catch (error) {
    console.error('SimpleThemeToggle 렌더링 중 오류 발생:', error);
    return <button className="simple-theme-toggle">테마 전환</button>;
  }
};

export default SimpleThemeToggle;