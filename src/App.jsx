import React, { useState, useEffect } from 'react'
import './App.css'
import Memo from './components/memo/Memo'
import memoService from './api/memoService'

function App() {
  const [memos, setMemos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 데이터 로딩
  useEffect(() => {
    const loadMemos = async () => {
      try {
        const data = await memoService.getAllMemos();
        setMemos(data);
      } catch (error) {
        console.error('메모를 불러오는 중 오류가 발생했습니다:', error);
        alert('메모를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadMemos();
  }, []);

  const addNewMemo = () => {
    setMemos([...memos, { id: Date.now() }]);
  };

  const handleDeleteMemo = (memoId) => {
    setMemos(memos.filter(memo => memo.id !== memoId));
  };

  const handleUpdateMemo = (updatedMemo) => {
    setMemos(memos.map(memo => 
      memo.id === updatedMemo.id ? updatedMemo : memo
    ));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>메모 앱</h1>
        <button onClick={addNewMemo} className="new-memo-button" disabled={isLoading}>
          새 메모
        </button>
      </header>
      
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
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default App