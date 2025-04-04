import React, { useState } from 'react';
import './CommentForm.css';

const CommentForm = ({ onSubmit, isLoading }) => {
  const [newComment, setNewComment] = useState('');
  const [commenterName, setCommenterName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newComment.trim() || !commenterName.trim()) {
      return;
    }
    
    onSubmit({
      text: newComment,
      author: commenterName
    });
    
    // 폼 초기화
    setNewComment('');
    setCommenterName('');
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="commenterName">이름</label>
        <input
          id="commenterName"
          type="text"
          placeholder="이름을 입력하세요"
          value={commenterName}
          onChange={(e) => setCommenterName(e.target.value)}
          required
          disabled={isLoading}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="commentText">댓글</label>
        <textarea
          id="commentText"
          placeholder="댓글을 입력하세요"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
          disabled={isLoading}
          className="form-textarea"
        />
      </div>
      
      <button 
        type="submit" 
        className="submit-button"
        disabled={isLoading}
      >
        {isLoading ? '처리 중...' : '댓글 등록'}
      </button>
    </form>
  );
};

export default CommentForm;