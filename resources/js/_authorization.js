/* eslint-disable */
import { signup, login, logout, forgotPassword, resetPassword, emailExists } from './api/auth';
import AuthModal from './classes/AuthModal';

document.addEventListener('DOMContentLoaded', function() {
  const formResetPassword = document.querySelector('.form--reset-pasword');
  const formForgot = document.querySelector('.form--forgot');
  const formSignup = document.querySelector('.form--signup');
  const formLogin = document.querySelector('.form--login');
  const logoutBtn = document.querySelector('#logout');
  const authModalTrigger = document.querySelector('a.auth__action');
  const authModal = document.querySelector('#signup-overlay');

  if (authModalTrigger && authModal) {
    new AuthModal(authModal, authModalTrigger);
  }

  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  if (formResetPassword) {
    formResetPassword.addEventListener('submit', async e => {
      e.preventDefault();
      const formData = new FormData(e.target);
      await resetPassword({
        token: formData.get('token'),
        p: formData.get('password'),
        pc: formData.get('passwordConfirm')
      });
    });
  }

  if (formSignup) {
    const formSignupEmail = formSignup.querySelector('#signup-email');
    formSignupEmail.onblur = async function() {
      const errorEmail = formSignup.querySelector('#signup-email-error');

      if (!validateEmail(this.value) ) {
        errorEmail.innerHTML = 'Пожалуйста, введите правильный email.'
        this.classList.add('form__input--error');
        formSignupEmail.focus();
        return;
      }

      const existUser = await emailExists(this.value);
      if (existUser) {
        errorEmail.innerHTML = 'Пользователь с таким Email уже зарегистрирован.'
        this.classList.add('form__input--error');
        return;
      }

      errorEmail.innerHTML = '';
      this.classList.remove('form__input--error');

    };

    formSignup.addEventListener('submit', async e => {
      e.preventDefault();
      const formData = new FormData(e.target);
      let submit = formSignup.querySelector('.button');
      submit.textContent = 'Регистрация...';
      submit.setAttribute('disabled',true);
      await signup({
        firstName: formData.get('firstName'),
        email: formData.get('email'),
        password: formData.get('password'),
        passwordConfirm: formData.get('passwordConfirm'),
        agree: formData.get('agree') ? true : false
      });
      submit.textContent = 'Создать учетную запись';
      submit.removeAttribute('disabled');
    });
  }

  if (formForgot) {
    formForgot.addEventListener('submit', e => {
      e.preventDefault();
      const email = formForgot.querySelector('#forgot-email').value;
      forgotPassword(email);
    });
  }

  if (formLogin) {
    formLogin.addEventListener('submit', e => {
      e.preventDefault();
      const email = formLogin.querySelector('#email').value;
      const password = formLogin.querySelector('#password').value;
      login(email, password);
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', e => {
      e.preventDefault();
      logout();
    });
  }
});