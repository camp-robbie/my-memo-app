import React, { useState } from 'react';
import './RoundMemo.css';

const RoundMemo = ({ initialData = {}, onDelete }) => {
  const [memo, setMemo] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    author: initialData.author || '',
    date: initialData.date || new Date().toISOString().split('T')[0],
    comments: initialData.comments || []
  });

  const [newComment, setNewComment] = useState('');
  const [commenterName, setCommenterName] = useState('');
  // 새로 생성된 메모(제목이 없는 경우)는 자동으로 편집 모드로 시작
  const [isEditing, setIsEditing] = useState(!initialData.title);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  const handleSaveMemo = () => {
    if (!memo.title || !memo.author) return;
    setIsEditing(false);
    // 여기에 저장 로직을 추가할 수 있습니다.
  };

  // 취소 버튼 기능 구현
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

  const handleDeleteMemo = () => {
    if (onDelete && initialData.id) {
      onDelete(initialData.id);
    }
  };

  return (
    <div className="memo-container">
      <div className="memo-card">
        {isEditing ? (
          // 편집 모드
          <div className="memo-edit-form">
            <input
              type="text"
              placeholder="제목"
              value={memo.title}
              onChange={(e) => setMemo({ ...memo, title: e.target.value })}
              className="memo-title-input"
            />
            <div className="memo-meta-inputs">
              <input
                type="text"
                placeholder="작성자"
                value={memo.author}
                onChange={(e) => setMemo({ ...memo, author: e.target.value })}
                className="memo-author-input"
              />
              <input
                type="date"
                value={memo.date}
                onChange={(e) => setMemo({ ...memo, date: e.target.value })}
                className="memo-date-input"
              />
            </div>
            <textarea
              placeholder="내용을 입력하세요..."
              value={memo.content}
              onChange={(e) => setMemo({ ...memo, content: e.target.value })}
              className="memo-content-input"
            />
            <div className="memo-edit-actions">
              <button onClick={handleSaveMemo} className="save-button">저장</button>
              <button onClick={handleCancelEdit} className="cancel-button">취소</button>
            </div>
          </div>
        ) : (
          // 보기 모드
          <div className="memo-view">
            <button 
              onClick={handleDeleteMemo} 
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
              <button onClick={() => setIsEditing(true)} className="edit-button">수정</button>
              <button onClick={() => setShowCommentForm(!showCommentForm)} className="comment-toggle-button">
                {showCommentForm ? '댓글 닫기' : '댓글 작성'}
              </button>
            </div>

            {/* 댓글 섹션 */}
            <div className="comments-section">
              <h3>댓글 ({memo.comments.length})</h3>
              
              {showCommentForm && (
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
              )}
              
              <div className="comments-list">
                {memo.comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    {editingCommentId === comment.id ? (
                      <div className="comment-edit-form">
                        <textarea
                          value={editingCommentText}
                          onChange={(e) => setEditingCommentText(e.target.value)}
                          className="comment-edit-input"
                        />
                        <div className="comment-edit-actions">
                          <button onClick={handleSaveEditedComment} className="save-comment-button">저장</button>
                          <button onClick={() => setEditingCommentId(null)} className="cancel-comment-button">취소</button>
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
                              onClick={() => handleEditComment(comment)} 
                              className="comment-edit-icon" 
                              title="댓글 수정"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleDeleteComment(comment.id)} 
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
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoundMemo;