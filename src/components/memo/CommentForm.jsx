import React from 'react';

const CommentForm = ({
  newComment,
  commenterName, 
  setNewComment, 
  setCommenterName, 
  handleAddComment
}) => {
  return (
    <div className="add-comment">
      <input
        type="text"
        placeholder="이름"
        value={commenterName}
        onChange={(e) => setCommenterName(e.target.value)}
        className="commenter-name-input"
      />
      <textarea
        placeholder="댓글을 입력하세요..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="comment-input"
      />
      <button onClick={handleAddComment} className="add-comment-button">등록</button>
    </div>
  );
};

export default CommentForm;
