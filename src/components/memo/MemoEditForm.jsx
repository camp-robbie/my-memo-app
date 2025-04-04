import React from 'react';

const MemoEditForm = ({ memo, onChange, onSave, onCancel }) => {
  return (
    <div className="memo-edit-form">
      <input
        type="text"
        placeholder="제목"
        value={memo.title}
        onChange={(e) => onChange({ ...memo, title: e.target.value })}
        className="memo-title-input"
      />
      <div className="memo-meta-inputs">
        <input
          type="text"
          placeholder="작성자"
          value={memo.author}
          onChange={(e) => onChange({ ...memo, author: e.target.value })}
          className="memo-author-input"
        />
        <input
          type="date"
          value={memo.date}
          onChange={(e) => onChange({ ...memo, date: e.target.value })}
          className="memo-date-input"
        />
      </div>
      <textarea
        placeholder="내용을 입력하세요..."
        value={memo.content}
        onChange={(e) => onChange({ ...memo, content: e.target.value })}
        className="memo-content-input"
      />
      <div className="memo-edit-actions">
        <button onClick={onSave} className="save-button">저장</button>
        <button onClick={onCancel} className="cancel-button">취소</button>
      </div>
    </div>
  );
};

export default MemoEditForm;
