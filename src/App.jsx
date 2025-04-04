import React, { useState } from 'react'
import './App.css'
import RoundMemo from './components/memo/RoundMemo'

function App() {
  const [memos, setMemos] = useState([
    {
      id: 1,
      title: '회의 내용 정리',
      content: '오늘 회의에서는 다음과 같은 내용이 논의되었습니다.\n1. 프로젝트 일정 검토\n2. 담당자 배정\n3. 다음 회의 일정',
      author: '김철수',
      date: '2025-04-01',
      comments: [
        {
          id: 101,
          text: '회의 내용 잘 정리해주셔서 감사합니다!',
          author: '이영희',
          date: '2025-04-02'
        },
        {
          id: 102,
          text: '다음 회의는 금요일 오후 2시로 확정되었습니다.',
          author: '박지훈',
          date: '2025-04-03'
        }
      ]
    }
  ]);

  const addNewMemo = () => {
    setMemos([...memos, { id: Date.now() }]);
  };

  const handleDeleteMemo = (memoId) => {
    setMemos(memos.filter(memo => memo.id !== memoId));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>메모 앱</h1>
        <button onClick={addNewMemo} className="new-memo-button">새 메모</button>
      </header>
      
      <div className="memos-container">
        {memos.map(memo => (
          <RoundMemo key={memo.id} initialData={memo} onDelete={handleDeleteMemo} />
        ))}
      </div>
    </div>
  )
}

export default App
