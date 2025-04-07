import React, { useState, useEffect } from 'react';
import Comments from '../comment/Comments';
import apiService from '../../api';
import './Memo.css';

const Memo = ({ initialData = {}, onDelete, onUpdate, isLoggedIn = false }) => {
  // 현재 날짜와 시간을 ISO 형식으로 포맷팅하는 함수
  const formatDateTimeForInput = (dateString) => {
    if (!dateString) {
      // 새 메모 생성 시 현재 시간 (서버에서 KST로 처리됨)
      const now = new Date();
      
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    
    try {
      // 기존 날짜 사용 (이미 KST로 저장되어 있음)
      const date = new Date(dateString);
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error('날짜 변환 오류:', error);
      // 오류 시 현재 시간 반환
      const now = new Date();
      
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  };

  const [memo, setMemo] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    author: initialData.author || '',
    date: formatDateTimeForInput(initialData.date),
  });

  // 메모의 ID를 추적하는 상태
  const [memoId, setMemoId] = useState(initialData.id || null);
  
  // 새로 생성된 메모(제목이 없는 경우)는 자동으로 편집 모드로 시작
  const [isEditing, setIsEditing] = useState(!initialData.title);
  const [showComments, setShowComments] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // initialData.id가 변경될 때 memoId 상태 업데이트
  useEffect(() => {
    if (initialData.id) {
      setMemoId(initialData.id);
    }
  }, [initialData.id]);

  // 메모 상세 정보 로드 (서버에서 최신 데이터 가져오기)
  useEffect(() => {
    const loadMemoDetails = async () => {
      // 새 메모인 경우 또는 ID가 없는 경우 건너뛰기
      if (!memoId || !initialData.title) return;
      
      setIsLoading(true);
      try {
        const memoDetails = await apiService.getMemoById(memoId);
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
  }, [memoId, initialData.title]);

  const handleSaveMemo = async () => {
    // if (!isLoggedIn) { // 인증 기능 구현 필요
    //   alert('메모를 저장하려면 로그인이 필요합니다.');
    //   return;
    // }
    
    if (!memo.title) {
      alert('제목은 필수 입력 항목입니다.');
      return;
    }

    setIsLoading(true);
    try {
      // 임시 ID이거나 ID가 없는 경우 (새 메모 생성)
      if (!memoId || String(memoId).startsWith('temp-') || initialData.temporary) {
        console.log('새 메모 생성 요청:', memo);
        const newMemo = await apiService.createMemo(memo);
        console.log('생성된 메모:', newMemo);
        
        // 새 메모 생성 후 페이지 새로고침
        alert('메모가 저장되었습니다. 댓글을 작성하려면 페이지가 새로고침됩니다.');
        window.location.reload();
        return; // 새로고침 후 아래 코드는 실행되지 않음
      } else {
        // 기존 메모 수정
        console.log('메모 수정 요청:', memoId, memo);
        const updatedMemo = await apiService.updateMemo(memoId, memo);
        if (onUpdate) {
          onUpdate({ 
            ...initialData, 
            ...updatedMemo,
            id: memoId // ID 명시적 유지
          });
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
    if (String(memoId).startsWith('temp-') || initialData.temporary || !initialData.title) {
      if (onDelete) {
        onDelete(memoId);
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
    // if (!isLoggedIn) {
    //   alert('메모를 삭제하려면 로그인이 필요합니다.');
    //   return;
    // }
    
    // 임시 메모인 경우 API 호출 없이 삭제
    if (String(memoId).startsWith('temp-') || initialData.temporary) {
      if (onDelete) {
        onDelete(memoId);
      }
      return;
    }
    
    if (!window.confirm('이 메모를 삭제하시겠습니까?')) {
      return;
    }

    if (onDelete && memoId) {
      setIsLoading(true);
      try {
        await apiService.deleteMemo(memoId);
        onDelete(memoId);
      } catch (error) {
        console.error('메모 삭제 중 오류 발생:', error);
        alert('메모를 삭제하는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditClick = () => {
    // if (!isLoggedIn) {
    //   alert('메모를 수정하려면 로그인이 필요합니다.');
    //   return;
    // }
    setIsEditing(true);
  };

  // 현재 memoId가 유효한지 확인하는 함수
  const hasValidMemoId = () => {
    return memoId && !String(memoId).startsWith('temp-') && !initialData.temporary;
  };

  // 댓글 버튼 클릭 핸들러
  const handleCommentsButtonClick = () => {
    // 유효한 메모 ID가 없는 경우, 메모를 먼저 저장하라는 메시지 표시
    if (!hasValidMemoId()) {
      if (!memo.title) {
        alert('댓글을 작성하려면 메모 제목을 입력하고 저장해야 합니다.');
        return;
      }
      
      alert('댓글을 작성하려면 먼저 메모를 저장해야 합니다. 저장 후 페이지가 새로고침됩니다.');
      handleSaveMemo();
      return;
    }
    
    // 정상적인 경우 댓글 토글
    setShowComments(!showComments);
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
                readOnly
                className="memo-author-input"
                disabled={isLoading}
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
              />
              <input
                type="datetime-local"
                value={memo.date}
                readOnly
                className="memo-date-input"
                disabled={isLoading}
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
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
              disabled={isLoading}
              // disabled={isLoading || !isLoggedIn}
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
                onClick={handleCommentsButtonClick} 
                className="comment-toggle-button"
                disabled={isLoading}
              >
                {showComments ? '댓글 닫기' : '댓글 보기'}
              </button>
            </div>

            {/* 댓글 컴포넌트 - 유효한 메모 ID가 있고 showComments가 true일 때만 표시 */}
            {showComments && hasValidMemoId() && (
              <Comments 
                memoId={memoId} 
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