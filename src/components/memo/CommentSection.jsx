import React from 'react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

const CommentSection = ({
  comments = [],
  showCommentForm,
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
}) => {
  return (
    <div className="comments-section">
      <h3>댓글 ({comments.length})</h3>
      
      {showCommentForm && (
        <CommentForm 
          newComment={newComment}
          commenterName={commenterName}
          setNewComment={setNewComment}
          setCommenterName={setCommenterName}
          handleAddComment={handleAddComment}
        />
      )}
      
      <div className="comments-list">
        {comments.map((comment) => (
          <CommentItem 
            key={comment.id}
            comment={comment}
            isEditing={editingCommentId === comment.id}
            editingText={editingCommentText}
            onEditTextChange={setEditingCommentText}
            onStartEditing={() => handleEditComment(comment)}
            onSaveEdit={handleSaveEditedComment}
            onCancelEdit={() => editingCommentId = null}
            onDelete={() => handleDeleteComment(comment.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
