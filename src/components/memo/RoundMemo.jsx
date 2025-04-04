import React, { useState } from 'react';
import MemoEditForm from './MemoEditForm';
import MemoView from './MemoView';
import '../RoundMemo.css';

const RoundMemo = ({ initialData = {}, onDelete }) => {
  const [memo, setMemo] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    author: initialData.author || '',
    date: initialData.date || new Date().toISOString().split('T')[0],
    comments: initialData.comments || []
  });

  // 상태 관리
  const [isEditing, setIsEditing] = useState(!initialData.title);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commenterName, setCommenterName] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  // 메모 관련 함수
  const handleSaveMemo = () => {
    if (!memo.title || !memo.author) return;
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    if (!initialData.title) {
      // 새 메모인 경우(제목이 없는 경우) - 메모 삭제
      onDelete(initialData.id);
    } else {
      // 기존 메모인 경우 - 편집을 취소하고 원래 상태로 복원
      setMemo({
        title: initialData.title || '',
        content: initialData.content || '',
        author: initialData.author || '',
        date: initialData.date || new Date().toISOString().split('T')[0],
        comments: initialData.comments || []
      });
      setIsEditing(false);
    }
  };

  const handleDeleteMemo = () => {
    if (onDelete && initialData.id) {
      onDelete(initialData.id);
    }
  };

  // 댓글 관련 함수
  const handleAddComment = () => {
    if (!newComment || !commenterName) return;
    
    const updatedComments = [
      ...memo.comments,
      {
        id: Date.now(),
        text: newComment,
        author: commenterName,
        date: new Date().toISOString().split('T')[0]
      }
    ];
    
    setMemo({ ...memo, comments: updatedComments });
    setNewComment('');
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.text);
  };

  const handleSaveEditedComment = () => {
    if (!editingCommentText.trim()) return;
    
    const updatedComments = memo.comments.map(comment => 
      comment.id === editingCommentId 
        ? {...comment, text: editingCommentText} 
        : comment
    );
    
    setMemo({ ...memo, comments: updatedComments });
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const handleDeleteComment = (commentId) => {
    const updatedComments = memo.comments.filter(comment => comment.id !== commentId);
    setMemo({ ...memo, comments: updatedComments });
  };

  // 댓글 관리 객체
  const commentManagement = {
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
  };

  return (
    <div className="memo-container">
      <div className="memo-card">
        {isEditing ? (
          <MemoEditForm 
            memo={memo}
            onChange={setMemo}
            onSave={handleSaveMemo}
            onCancel={handleCancelEdit}
          />
        ) : (
          <MemoView 
            memo={memo}
            onDelete={handleDeleteMemo}
            onEdit={() => setIsEditing(true)}
            showCommentForm={showCommentForm}
            setShowCommentForm={setShowCommentForm}
            commentManagement={commentManagement}
          />
        )}
      </div>
    </div>
  );
};

export default RoundMemo;
