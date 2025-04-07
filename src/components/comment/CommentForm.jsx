import React, { useState } from 'react';
import './CommentForm.css';

const CommentForm = ({ onSubmit, isLoading }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      return;
    }
    
    onSubmit({
      text: newComment,
      author: '익명' // 이름 입력을 제거하고 항상 '익명'으로 설정
    });
    
    // 폼 초기화
    setNewComment('');
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
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