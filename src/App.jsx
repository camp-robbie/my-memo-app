import React, { useState, useEffect, useContext } from 'react'
import './App.css'
import Memo from './components/memo/Memo'
import ThemeToggle from './components/ThemeToggle'
import AuthButton from './components/auth/AuthButton'
import { AuthContext } from './context/AuthContext'
import apiService from './api'

function App() {
  const [memos, setMemos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);

  // 초기 데이터 로딩 (메모 목록 가져오기)
  useEffect(() => {
    const loadMemos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiService.getAllMemos();
        setMemos(data);
      } catch (error) {
        console.error('메모를 불러오는 중 오류가 발생했습니다:', error);
        setError('메모를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    loadMemos();
  }, [isAuthenticated]); // 인증 상태가 변경되면 메모 목록 갱신

  // 새 메모 생성
  const addNewMemo = () => {
    // 로그인되지 않은 경우 처리
    // if (!isAuthenticated) {
    //   alert('메모를 작성하려면 로그인이 필요합니다.');
    //   return;
    // }
    
    // 임시 ID는 문자열로 생성하여 서버에서 부여하는 ID와 충돌 방지
    const tempId = 'temp-' + Date.now();
    const newMemo = { 
      id: tempId, 
      temporary: true,
      title: '',
      content: '',
      author: '',
      date: new Date().toISOString() // 현재 시간으로 설정 (서버에서 KST로 처리)
    };
    setMemos([...memos, newMemo]);
  };

  // 메모 삭제
  const handleDeleteMemo = (memoId) => {
    setMemos(memos.filter(memo => memo.id !== memoId));
  };

  // 메모 업데이트
  const handleUpdateMemo = (updatedMemo) => {
    setMemos(memos.map(memo => 
      memo.id === updatedMemo.id ? { ...updatedMemo, temporary: false } : memo
    ));
  };

  // 새로고침 함수
  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getAllMemos();
      setMemos(data);
    } catch (error) {
      console.error('메모를 새로고침하는 중 오류가 발생했습니다:', error);
      setError('메모를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <h1>메모 앱</h1>
          {!isLoading && (
            <button onClick={handleRefresh} className="refresh-button" title="새로고침">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 4v6h-6"></path>
                <path d="M1 20v-6h6"></path>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
                <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path>
              </svg>
            </button>
          )}
        </div>
        
        <div className="theme-toggle-wrapper">
          <ThemeToggle />
        </div>
        
        <div className="action-buttons-wrapper">
          <button onClick={addNewMemo} className="new-memo-button" disabled={isLoading}>
            새 메모
          </button>
          <AuthButton />
        </div>
      </header>
      
      {error && (
        <div className="error-container">
          <p>{error}</p>
          <button onClick={handleRefresh} className="retry-button">다시 시도</button>
        </div>
      )}
      
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>메모를 불러오는 중...</p>
        </div>
      ) : (
        <div className="memos-container">
          {memos.length === 0 ? (
            <div className="no-memos">
              <p>저장된 메모가 없습니다. 새 메모를 작성해보세요!</p>
            </div>
          ) : (
            memos.map(memo => (
              <Memo 
                key={memo.id} 
                initialData={memo} 
                onDelete={handleDeleteMemo}
                onUpdate={handleUpdateMemo}
                isLoggedIn={isAuthenticated}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default App