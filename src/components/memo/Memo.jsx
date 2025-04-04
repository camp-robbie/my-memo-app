import React, { useState, useEffect } from 'react';
import Comments from '../comment/Comments';
import memoService from '../../api/memoService';
import './Memo.css';

const Memo = ({ initialData = {}, onDelete, onUpdate }) => {
  const [memo, setMemo] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    author: initialData.author || '',
    date: initialData.date || new Date().toISOString().split('T')[0],
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
        const memoDetails = await memoService.getMemoById(initialData.id);
        setMemo({
          title: memoDetails.title || '',
          content: memoDetails.content || '',
          author: memoDetails.author || initialData.author || '',
          date: memoDetails.createdAt || initialData.date || new Date().toISOString().split('T')[0],
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
    if (!memo.title) {
      alert('제목은 필수 입력 항목입니다.');
      return;
    }

    setIsLoading(true);
    try {
      if (!initialData.id) {
        // 새 메모 생성
        const newMemo = await memoService.createMemo(memo);
        if (onUpdate) {
          onUpdate(newMemo);
        }
      } else {
        // 기존 메모 수정
        const updatedMemo = await memoService.updateMemo(initialData.id, memo);
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
    if (!initialData.title) {
      // 새 메모인 경우(제목이 없는 경우) - 메모 삭제
      onDelete(initialData.id);
    } else {
      // 기존 메모인 경우 - 편집을 취소하고 원래 상태로 복원
      setMemo({
        title: initialData.title || '',
        content: initialData.content || '',
        author: initialData.author || '',
        date: initialData.date || new Date().toISOString().split('T')[0],
      });
      setIsEditing(false);
    }
  };

  const handleDeleteMemo = async () => {
    if (!window.confirm('이 메모를 삭제하시겠습니까?')) {
      return;
    }

    if (onDelete && initialData.id) {
      setIsLoading(true);
      try {
        await memoService.deleteMemo(initialData.id);
        onDelete(initialData.id);
      } catch (error) {
        console.error('메모 삭제 중 오류 발생:', error);
        alert('메모를 삭제하는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
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
                type="date"
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
              disabled={isLoading}
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
                {memo.date && <span className="memo-date">작성일: {memo.date}</span>}
              </div>
            </div>
            <div className="memo-content">{memo.content}</div>
            <div className="memo-actions">
              <button 
                onClick={() => setIsEditing(true)} 
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
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Memo;