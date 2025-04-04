import React, { useState } from 'react';
import './CommentItem.css';

const CommentItem = ({ comment, onUpdate, onDelete, isLoading }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // comment가 null인 경우를 처리
  if (!comment) {
    console.error('유효하지 않은 댓글 객체:', comment);
    return null;
  }
  
  // 댓글 내용 가져오기 (content 또는 text 필드 사용)
  const commentText = ((comment.content || comment.text) || '').toString();
  const [editedText, setEditedText] = useState(commentText);

  const handleSaveEdit = () => {
    if (!editedText.trim()) return;
    
    onUpdate({
      ...comment,
      text: editedText,
      content: editedText // API와의 호환성을 위해 두 필드 모두 설정
    });
    
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedText(commentText);
    setIsEditing(false);
  };

  // 날짜 형식화 함수
  const formatDate = (dateString) => {
    if (!dateString) return '날짜 정보 없음';
    
    try {
      // 날짜 문자열을 한국 시간대(UTC+9)로 변환하여 표시
      const date = new Date(dateString);
      // 시간대 보정 (서버 시간을 한국 시간으로 표시)
      const koreaTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);
      return koreaTime.toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true // 12시간제 사용 (오전/오후 표시)
      });
    } catch (e) {
      console.error('날짜 변환 오류:', e);
      return dateString; // 변환 실패 시 원래 문자열 반환
    }
  };

  return (
    <div className="comment-item">
      {isEditing ? (
        <div className="comment-edit-form">
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="comment-edit-input"
            disabled={isLoading}
          />
          <div className="comment-edit-actions">
            <button 
              onClick={handleSaveEdit} 
              className="save-comment-button"
              disabled={isLoading || !editedText.trim()}
            >
              저장
            </button>
            <button 
              onClick={handleCancelEdit} 
              className="cancel-comment-button"
              disabled={isLoading}
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="comment-header">
            <div className="comment-info">
              <span className="comment-author">{comment.author || '익명'}</span>
              <span className="comment-date">
                {formatDate(comment.date)}
              </span>
            </div>
            <div className="comment-actions">
              <button 
                onClick={() => setIsEditing(true)} 
                className="comment-edit-icon" 
                title="댓글 수정"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
              </button>
              <button 
                onClick={() => onDelete(comment.id)} 
                className="comment-delete-icon" 
                title="댓글 삭제"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>
          <div className="comment-text">{commentText || '(내용 없음)'}</div>
        </>
      )}
    </div>
  );
};

export default CommentItem;