import React, { useState, useEffect } from 'react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import apiService from '../../api';
import './Comments.css';

const Comments = ({ memoId, initialComments = [] }) => {
  const [comments, setComments] = useState(initialComments);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 댓글 목록 불러오기
  useEffect(() => {
    const loadComments = async () => {
      if (!memoId) return;
      
      setIsLoading(true);
      try {
        const loadedComments = await apiService.getComments(memoId);
        setComments(loadedComments);
      } catch (error) {
        console.error('댓글을 불러오는 중 오류가 발생했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [memoId]);

  const handleAddComment = async (newComment) => {
    setIsLoading(true);
    try {
      const addedComment = await apiService.addComment(memoId, newComment);
      setComments([...comments, addedComment]);
      setShowCommentForm(false);
    } catch (error) {
      console.error('댓글 추가 중 오류 발생:', error);
      alert('댓글을 추가하는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateComment = async (updatedComment) => {
    setIsLoading(true);
    try {
      await apiService.updateComment(updatedComment.id, updatedComment.text);
      const updatedComments = comments.map(comment => 
        comment.id === updatedComment.id ? updatedComment : comment
      );
      setComments(updatedComments);
    } catch (error) {
      console.error('댓글 수정 중 오류 발생:', error);
      alert('댓글을 수정하는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('이 댓글을 삭제하시겠습니까?')) {
      return;
    }

    setIsLoading(true);
    try {
      await apiService.deleteComment(commentId);
      const updatedComments = comments.filter(comment => comment.id !== commentId);
      setComments(updatedComments);
    } catch (error) {
      console.error('댓글 삭제 중 오류 발생:', error);
      alert('댓글을 삭제하는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="comments-section">
      <div className="comments-header">
        <h3>댓글 ({comments.length})</h3>
        <button 
          onClick={() => setShowCommentForm(!showCommentForm)} 
          className="add-comment-button"
          disabled={isLoading}
        >
          {showCommentForm ? '취소' : '댓글 작성'}
        </button>
      </div>

      {showCommentForm && (
        <CommentForm onSubmit={handleAddComment} isLoading={isLoading} />
      )}
      
      <div className="comments-list">
        {isLoading && <div className="loading-indicator">처리 중...</div>}
        
        {comments.length === 0 ? (
          <p className="no-comments">아직 댓글이 없습니다.</p>
        ) : (
          comments.map(comment => (
            <CommentItem 
              key={comment.id}
              comment={comment}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
              isLoading={isLoading}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;