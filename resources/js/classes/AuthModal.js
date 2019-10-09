/* eslint-disable */
module.exports = class AuthModal {
  constructor(modal, trigger) {
    this._trigger = trigger;
    this._modal = modal;
    this.formSignup = modal.querySelector('.form--signup');
    this.signupFields = modal.querySelector('#signup-fields');
    this.loginFields = modal.querySelector('#login-fields');
    this.forgotFields = modal.querySelector('#forgot-fields');
    trigger.onclick = this.openModal.bind(this);
    modal.onclick = this.onClick.bind(this);
  }

  openModal(event) {
    event.preventDefault();
    this._modal.classList.add('overlay--visible');
  }

  closeModal() {
    this._modal.classList.remove('overlay--visible');
  }

  showSignupForm() {
    console.log('showSignupForm');
    this.formSignup.classList.add('show');
  }

  showLoginFields() {
    console.log('showLoginFields');
    this.loginFields.classList.remove('hide');
    this.signupFields.classList.add('hide');
    this.forgotFields.classList.add('hide');
  }

  showSignupFields() {
    console.log('showSignupFields');
    this.signupFields.classList.remove('hide');
    this.loginFields.classList.add('hide');
    this.forgotFields.classList.add('hide');
  }

  showForgotFields(event) {
    event.preventDefault();
    console.log('showForgotFields');
    this.forgotFields.classList.remove('hide');
    this.loginFields.classList.add('hide');
    this.signupFields.classList.add('hide');
  }

  onClick(event) {
    const target = event.target;
    if (this._modal === target) {
      this.closeModal();
      return;
    }

    const action = target.closest('.js');

    if (action) {
      let f = action.dataset.action;
      if (f) {
        this[f](event);
      }
    }
  }
}
