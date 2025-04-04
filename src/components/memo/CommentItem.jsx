import React from 'react';

const CommentItem = ({ 
  comment, 
  isEditing, 
  editingText,
  onEditTextChange,
  onStartEditing,
  onSaveEdit,
  onCancelEdit,
  onDelete
}) => {
  return (
    <div className="comment">
      {isEditing ? (
        <div className="comment-edit-form">
          <textarea
            value={editingText}
            onChange={(e) => onEditTextChange(e.target.value)}
            className="comment-edit-input"
          />
          <div className="comment-edit-actions">
            <button onClick={onSaveEdit} className="save-comment-button">저장</button>
            <button onClick={onCancelEdit} className="cancel-comment-button">취소</button>
          </div>
        </div>
      ) : (
        <>
          <div className="comment-header">
            <div className="comment-info">
              <span className="comment-author">{comment.author}</span>
              <span className="comment-date">{comment.date}</span>
            </div>
            <div className="comment-actions">
              <button 
                onClick={onStartEditing} 
                className="comment-edit-icon" 
                title="댓글 수정"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
              </button>
              <button 
                onClick={onDelete} 
                className="comment-delete-icon" 
                title="댓글 삭제"
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
          <div className="comment-text">{comment.text}</div>
        </>
      )}
    </div>
  );
};

export default CommentItem;
