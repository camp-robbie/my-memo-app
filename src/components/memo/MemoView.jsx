import React from 'react';
import CommentSection from './CommentSection';

const MemoView = ({ 
  memo, 
  onDelete, 
  onEdit, 
  showCommentForm, 
  setShowCommentForm, 
  commentManagement 
}) => {
  const { 
    newComment, 
    commenterName, 
    setNewComment, 
    setCommenterName, 
    handleAddComment, 
    editingCommentId, 
    editingCommentText, 
    setEditingCommentText, 
    handleEditComment, 
    handleSaveEditedComment, 
    handleDeleteComment 
  } = commentManagement;

  return (
    <div className="memo-view">
      <button 
        onClick={onDelete} 
        className="memo-delete-icon" 
        title="메모 삭제"
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
          <span className="memo-author">작성자: {memo.author}</span>
          <span className="memo-date">작성일: {memo.date}</span>
        </div>
      </div>
      <div className="memo-content">{memo.content}</div>
      <div className="memo-actions">
        <button onClick={onEdit} className="edit-button">수정</button>
        <button onClick={() => setShowCommentForm(!showCommentForm)} className="comment-toggle-button">
          {showCommentForm ? '댓글 닫기' : '댓글 작성'}
        </button>
      </div>

      {/* 댓글 섹션 */}
      <CommentSection 
        comments={memo.comments}
        showCommentForm={showCommentForm}
        newComment={newComment}
        commenterName={commenterName}
        setNewComment={setNewComment}
        setCommenterName={setCommenterName}
        handleAddComment={handleAddComment}
        editingCommentId={editingCommentId}
        editingCommentText={editingCommentText}
        setEditingCommentText={setEditingCommentText}
        handleEditComment={handleEditComment}
        handleSaveEditedComment={handleSaveEditedComment}
        handleDeleteComment={handleDeleteComment}
      />
    </div>
  );
};

export default MemoView;
