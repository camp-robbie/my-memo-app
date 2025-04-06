import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Modal from '../common/Modal';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';
import './AuthButton.css';

const AuthButton = () => {
  const { isAuthenticated, currentUser } = useContext(AuthContext);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

  return (
    <div className="auth-button-container">
      {isAuthenticated ? (
        <>
          <button className="auth-button user-button" onClick={handleProfileClick}>
            <span className="user-avatar-small">
              {currentUser?.email?.charAt(0).toUpperCase() || '?'}
            </span>
            <span className="auth-button-text">내 계정</span>
          </button>
          
          <Modal isOpen={showProfileModal} onClose={closeProfileModal}>
            <UserProfile onClose={closeProfileModal} />
          </Modal>
        </>
      ) : (
        <>
          <button className="auth-button login-button" onClick={handleLoginClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            <span className="auth-button-text">로그인</span>
          </button>
          
          <Modal isOpen={showLoginModal} onClose={closeLoginModal}>
            <LoginForm onClose={closeLoginModal} />
          </Modal>
        </>
      )}
    </div>
  );
};

export default AuthButton;