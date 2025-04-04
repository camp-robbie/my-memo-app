import React, { useState } from 'react';
import './CommentItem.css';

const CommentItem = ({ comment, onUpdate, onDelete, isLoading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);

  const handleSaveEdit = () => {
    if (!editedText.trim()) return;
    
    onUpdate({
      ...comment,
      text: editedText
    });
    
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedText(comment.text);
    setIsEditing(false);
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
              disabled={isLoading}
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
              <span className="comment-author">{comment.author}</span>
              <span className="comment-date">{comment.date}</span>
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
          <div className="comment-text">{comment.text}</div>
        </>
      )}
    </div>
  );
};

export default CommentItem;