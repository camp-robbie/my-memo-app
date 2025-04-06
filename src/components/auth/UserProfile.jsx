import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './UserProfile.css';

const UserProfile = ({ onClose }) => {
  const { currentUser, logout, changePassword, deleteAccount } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  
  // 비밀번호 변경 상태
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  
  // 계정 삭제 상태
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 비밀번호 변경 처리
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (newPassword.length < 8) {
      setPasswordChangeMessage('새 비밀번호는 8자 이상이어야 합니다.');
      setPasswordChangeSuccess(false);
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      setPasswordChangeMessage('새 비밀번호가 일치하지 않습니다.');
      setPasswordChangeSuccess(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await changePassword(currentPassword, newPassword);
      
      if (result.success) {
        setPasswordChangeMessage('비밀번호가 성공적으로 변경되었습니다.');
        setPasswordChangeSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setPasswordChangeMessage(result.message || '비밀번호 변경에 실패했습니다.');
        setPasswordChangeSuccess(false);
      }
    } catch (err) {
      setPasswordChangeMessage('처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
      setPasswordChangeSuccess(false);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 계정 삭제 처리
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (deleteConfirmText !== '계정삭제') {
      setDeleteMessage('확인 텍스트가 일치하지 않습니다.');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await deleteAccount(deleteConfirmPassword);
      
      if (result.success) {
        // 계정 삭제 성공
        if (onClose) {
          onClose();
        }
      } else {
        setDeleteMessage(result.message || '계정 삭제에 실패했습니다.');
      }
    } catch (err) {
      setDeleteMessage('처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    logout();
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <h2>내 계정</h2>
        {onClose && (
          <button onClick={onClose} className="close-button" aria-label="닫기">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
      
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          프로필
        </button>
        <button 
          className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          보안
        </button>
        <button 
          className={`tab-button ${activeTab === 'delete' ? 'active' : ''}`}
          onClick={() => setActiveTab('delete')}
        >
          계정 삭제
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'profile' && (
          <div className="profile-tab">
            <div className="user-info">
              <div className="user-avatar">
                {currentUser?.email?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="user-details">
                <h3>{currentUser?.email}</h3>
                <p className="user-since">가입일: {new Date(currentUser?.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="action-buttons">
              <button onClick={handleLogout} className="logout-button">
                로그아웃
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'security' && (
          <div className="security-tab">
            <h3>비밀번호 변경</h3>
            
            {passwordChangeMessage && (
              <div className={`message ${passwordChangeSuccess ? 'success' : 'error'}`}>
                {passwordChangeMessage}
              </div>
            )}
            
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label htmlFor="currentPassword">현재 비밀번호</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">새 비밀번호</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="8자 이상"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmNewPassword">새 비밀번호 확인</label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <button 
                type="submit" 
                className="change-password-button"
                disabled={isLoading}
              >
                {isLoading ? '처리 중...' : '비밀번호 변경'}
              </button>
            </form>
          </div>
        )}
        
        {activeTab === 'delete' && (
          <div className="delete-tab">
            <h3>계정 삭제</h3>
            <p className="delete-warning">
              계정을 삭제하면 모든 데이터가 영구적으로 손실됩니다. 이 작업은 취소할 수 없습니다.
            </p>
            
            {deleteMessage && (
              <div className="message error">
                {deleteMessage}
              </div>
            )}
            
            <form onSubmit={handleDeleteAccount}>
              <div className="form-group">
                <label htmlFor="deletePassword">비밀번호</label>
                <input
                  type="password"
                  id="deletePassword"
                  value={deleteConfirmPassword}
                  onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="deleteConfirm">확인을 위해 '계정삭제'를 입력하세요</label>
                <input
                  type="text"
                  id="deleteConfirm"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <button 
                type="submit" 
                className="delete-account-button"
                disabled={isLoading || deleteConfirmText !== '계정삭제'}
              >
                {isLoading ? '처리 중...' : '계정 영구 삭제'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;