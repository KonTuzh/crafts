/* eslint-disable */
import AuthModal from './classes/AuthModal';

const createAuthModalInstance = () => {
  const authModalTrigger = document.querySelector('a.auth__action');
  const authModal = document.querySelector('#signup-overlay');

  if (authModalTrigger && authModal) {
    return new AuthModal(authModal, authModalTrigger);
  }
};

export default () => {
  document.addEventListener("DOMContentLoaded", createAuthModalInstance);
};


