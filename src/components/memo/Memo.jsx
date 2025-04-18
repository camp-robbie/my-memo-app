import React, { useState, useEffect } from 'react';
import Comments from '../comment/Comments';
import apiService from '../../api';
import './Memo.css';

const Memo = ({ initialData = {}, onDelete, onUpdate, isLoggedIn = false }) => {
  // 현재 날짜와 시간을 ISO 형식으로 포맷팅하는 함수
  const formatDateTimeForInput = (dateString) => {
    if (!dateString) {
      const now = new Date();
      return now.toISOString().slice(0, 16);
    }
    
    try {
      const date = new Date(dateString);
      
      // 서버 시간을 그대로 유지하기 위해 시간대 조정 없이 반환
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error('날짜 변환 오류:', error);
      const now = new Date();
      return now.toISOString().slice(0, 16);
    }
  };

  const [memo, setMemo] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    author: initialData.author || '',
    date: formatDateTimeForInput(initialData.date),
  });

  // 새로 생성된 메모(제목이 없는 경우)는 자동으로 편집 모드로 시작
  const [isEditing, setIsEditing] = useState(!initialData.title);
  const [showComments, setShowComments] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 메모 상세 정보 로드 (서버에서 최신 데이터 가져오기)
  useEffect(() => {
    const loadMemoDetails = async () => {
      // 새 메모인 경우 또는 ID가 없는 경우 건너뛰기
      if (!initialData.id || !initialData.title) return;
      
      setIsLoading(true);
      try {
        const memoDetails = await apiService.getMemoById(initialData.id);
        setMemo({
          title: memoDetails.title || '',
          content: memoDetails.content || '',
          author: memoDetails.author || initialData.author || '',
          date: formatDateTimeForInput(memoDetails.updatedAt || initialData.date),
        });
      } catch (error) {
        console.error('메모 상세 정보를 불러오는 중 오류가 발생했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMemoDetails();
  }, [initialData.id, initialData.title]);

  const handleSaveMemo = async () => {
    if (!isLoggedIn) {
      alert('메모를 저장하려면 로그인이 필요합니다.');
      return;
    }
    
    if (!memo.title) {
      alert('제목은 필수 입력 항목입니다.');
      return;
    }

    setIsLoading(true);
    try {
      // 임시 ID이거나 ID가 없는 경우 (새 메모 생성)
      if (!initialData.id || String(initialData.id).startsWith('temp-') || initialData.temporary) {
        console.log('새 메모 생성 요청:', memo);
        const newMemo = await apiService.createMemo(memo);
        console.log('생성된 메모:', newMemo);
        if (onUpdate) {
          onUpdate({
            ...newMemo,
            id: newMemo.id // 서버에서 생성된 ID로 업데이트
          });
        }
      } else {
        // 기존 메모 수정
        console.log('메모 수정 요청:', initialData.id, memo);
        const updatedMemo = await apiService.updateMemo(initialData.id, memo);
        if (onUpdate) {
          onUpdate({ ...initialData, ...updatedMemo });
        }
      }
      setIsEditing(false);
    } catch (error) {
      console.error('메모 저장 중 오류 발생:', error);
      alert('메모를 저장하는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 취소 버튼 기능 구현
  const handleCancelEdit = () => {
    // 임시 ID이거나 제목이 없는 경우 메모 삭제 (새 메모)
    if (String(initialData.id).startsWith('temp-') || initialData.temporary || !initialData.title) {
      if (onDelete) {
        onDelete(initialData.id);
      }
    } else {
      // 기존 메모인 경우 - 편집을 취소하고 원래 상태로 복원
      setMemo({
        title: initialData.title || '',
        content: initialData.content || '',
        author: initialData.author || '',
        date: formatDateTimeForInput(initialData.date),
      });
      setIsEditing(false);
    }
  };

  const handleDeleteMemo = async () => {
    if (!isLoggedIn) {
      alert('메모를 삭제하려면 로그인이 필요합니다.');
      return;
    }
    
    // 임시 메모인 경우 API 호출 없이 삭제
    if (String(initialData.id).startsWith('temp-') || initialData.temporary) {
      if (onDelete) {
        onDelete(initialData.id);
      }
      return;
    }
    
    if (!window.confirm('이 메모를 삭제하시겠습니까?')) {
      return;
    }

    if (onDelete && initialData.id) {
      setIsLoading(true);
      try {
        await apiService.deleteMemo(initialData.id);
        onDelete(initialData.id);
      } catch (error) {
        console.error('메모 삭제 중 오류 발생:', error);
        alert('메모를 삭제하는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditClick = () => {
    if (!isLoggedIn) {
      alert('메모를 수정하려면 로그인이 필요합니다.');
      return;
    }
    setIsEditing(true);
  };

  return (
    <div className="memo-container">
      <div className={`memo-card ${isLoading ? 'loading' : ''}`}>
        {isLoading && <div className="memo-loading-overlay">처리 중...</div>}
        
        {isEditing ? (
          // 편집 모드
          <div className="memo-edit-form">
            <input
              type="text"
              placeholder="제목"
              value={memo.title}
              onChange={(e) => setMemo({ ...memo, title: e.target.value })}
              className="memo-title-input"
              disabled={isLoading}
            />
            <div className="memo-meta-inputs">
              <input
                type="text"
                placeholder="작성자"
                value={memo.author}
                onChange={(e) => setMemo({ ...memo, author: e.target.value })}
                className="memo-author-input"
                disabled={isLoading}
              />
              <input
                type="datetime-local"
                value={memo.date}
                onChange={(e) => setMemo({ ...memo, date: e.target.value })}
                className="memo-date-input"
                disabled={isLoading}
              />
            </div>
            <textarea
              placeholder="내용을 입력하세요..."
              value={memo.content}
              onChange={(e) => setMemo({ ...memo, content: e.target.value })}
              className="memo-content-input"
              disabled={isLoading}
            />
            <div className="memo-edit-actions">
              <button 
                onClick={handleSaveMemo} 
                className="save-button"
                disabled={isLoading}
              >
                저장
              </button>
              <button 
                onClick={handleCancelEdit} 
                className="cancel-button"
                disabled={isLoading}
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          // 보기 모드
          <div className="memo-view">
            <button 
              onClick={handleDeleteMemo} 
              className="memo-delete-icon" 
              title="메모 삭제"
              disabled={isLoading || !isLoggedIn}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
            <div className="memo-header">
              <h2 className="memo-title">{memo.title}</h2>
              <div className="memo-meta">
                {memo.author && <span className="memo-author">작성자: {memo.author}</span>}
                {memo.date && (
                  <span className="memo-date">
                    작성일: {
                      (() => {
                        try {
                          const date = new Date(memo.date);
                          
                          // 서버 시간을 그대로 표시
                          return date.toLocaleString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false // 24시간제
                          });
                        } catch (e) {
                          console.error('날짜 형식 변환 오류:', e);
                          return memo.date;
                        }
                      })()
                    }
                  </span>
                )}
              </div>
            </div>
            <div className="memo-content">{memo.content}</div>
            <div className="memo-actions">
              <button 
                onClick={handleEditClick} 
                className="edit-button"
                disabled={isLoading}
              >
                수정
              </button>
              <button 
                onClick={() => setShowComments(!showComments)} 
                className="comment-toggle-button"
                disabled={isLoading}
              >
                {showComments ? '댓글 닫기' : '댓글 보기'}
              </button>
            </div>

            {/* 댓글 컴포넌트 */}
            {showComments && (
              <Comments 
                memoId={initialData.id} 
                initialComments={initialData.comments || []} 
                isLoggedIn={isLoggedIn}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Memo;