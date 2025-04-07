import React, { useState, useEffect } from 'react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import apiService from '../../api';
import './Comments.css';

const Comments = ({ memoId, initialComments = [], isLoggedIn = false }) => {
  // API 응답의 구조에 맞게 초기 댓글 데이터 변환
  const formatComments = (commentList) => {
    if (!Array.isArray(commentList)) {
      console.error('댓글 목록이 배열이 아닙니다:', commentList);
      return [];
    }
    
    return commentList.map(comment => {
      // comment가 null인 경우 처리
      if (!comment) {
        console.error('유효하지 않은 댓글:', comment);
        return {
          id: Date.now() + Math.random(),
          text: '오류: 댓글을 불러올 수 없습니다.',
          content: '오류: 댓글을 불러올 수 없습니다.',
          author: '시스템',
          date: new Date().toISOString()
        };
      }
      
      // content 또는 text 값이 없는 경우를 위한 fallback 처리
      const commentText = comment.content || comment.text || '';
      
      return {
        id: comment.id || Date.now() + Math.random(),
        text: commentText,
        content: commentText,
        author: comment.author || '익명',
        date: comment.date || comment.updatedAt || comment.createdAt || new Date().toISOString()
      };
    });
  };

  const [comments, setComments] = useState(formatComments(initialComments));
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 댓글 목록 불러오기
  useEffect(() => {
    const loadComments = async () => {
      if (!memoId) return;
      
      setIsLoading(true);
      try {
        const loadedComments = await apiService.getComments(memoId);
        // API 응답 구조에 맞게 데이터 처리
        setComments(formatComments(loadedComments));
      } catch (error) {
        console.error('댓글을 불러오는 중 오류가 발생했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [memoId]);

  const handleAddComment = async (newComment) => {
    // 로그인 확인
    // if (!isLoggedIn) {
    //   alert('댓글을 작성하려면 로그인이 필요합니다.');
    //   return;
    // }
    
    if (!newComment.text || !newComment.author) {
      console.error('댓글 내용 또는 작성자가 누락되었습니다');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('새 댓글 추가 요청:', newComment);
      const addedComment = await apiService.addComment(memoId, newComment);
      console.log('서버 응답 댓글:', addedComment);
      
      // 댓글이 제대로 반환되었는지 확인
      if (!addedComment || !addedComment.id) {
        throw new Error('서버에서 유효한 댓글을 반환하지 않았습니다');
      }
      
      // 새 댓글 추가
      setComments(prevComments => [...prevComments, addedComment]);
      setShowCommentForm(false);
    } catch (error) {
      console.error('댓글 추가 중 오류 발생:', error);
      alert('댓글을 추가하는 데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateComment = async (updatedComment) => {
    // 로그인 확인
    // if (!isLoggedIn) {
    //   alert('댓글을 수정하려면 로그인이 필요합니다.');
    //   return;
    // }
    
    setIsLoading(true);
    try {
      const response = await apiService.updateComment(updatedComment.id, updatedComment.text || updatedComment.content);
      // 응답 구조가 다양한 경우를 고려하여 처리
      const updatedContent = response.content || response.text || updatedComment.text || updatedComment.content;
      const updatedDate = response.updatedAt || response.date || new Date().toISOString();
      
      const updatedComments = comments.map(comment => 
        comment.id === updatedComment.id ? {
          ...comment,
          text: updatedContent,
          content: updatedContent,
          date: updatedDate
        } : comment
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
    // 로그인 확인
    // if (!isLoggedIn) {
    //   alert('댓글을 삭제하려면 로그인이 필요합니다.');
    //   return;
    // }
    
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

  // 댓글 작성 폼 토글
  const toggleCommentForm = () => {
    // if (!isLoggedIn) {
    //   alert('댓글을 작성하려면 로그인이 필요합니다.');
    //   return;
    // }
    setShowCommentForm(!showCommentForm);
  };

  return (
    <div className="comments-section">
      <div className="comments-header">
        <h3>댓글 ({comments.length})</h3>
        <button 
          onClick={toggleCommentForm} 
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
              isLoggedIn={isLoggedIn}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;