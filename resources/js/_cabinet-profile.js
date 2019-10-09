import { updateSettings, updatePassword } from './api/update-user';

document.addEventListener('DOMContentLoaded', function() {
  const formUserAvatar = document.querySelector('#form-user-avatar');
  const formUserSettings = document.querySelector('#form-user-settings');
  const formUserPassword = document.querySelector('#form-user-password');

  // User Account
  if (formUserAvatar) {
    const inputPhoto = formUserAvatar.querySelector('#photo');
    inputPhoto.addEventListener('change', async e => {
      if (e.target.files && e.target.files[0]) {
        let reader = new FileReader();
        let userPhoto = formUserAvatar.querySelector('#user-photo');
        const formData = new FormData(formUserAvatar);
        reader.onload = e => userPhoto.setAttribute('src', e.target.result);
        reader.readAsDataURL(e.target.files[0]);
        await updateSettings(formData);
      }
    });
  }

  if (formUserSettings) {
    formUserSettings.addEventListener('submit', async e => {
      e.preventDefault();
      let submit = formUserSettings.querySelector('.button');
      submit.textContent = 'Обновление...';
      submit.setAttribute('disabled',true);
      const formData = new FormData(e.target);
      await updateSettings(formData);
      submit.textContent = 'Сохранить изменения';
      submit.removeAttribute('disabled', true);
    });
  }

  if (formUserPassword) {
    formUserPassword.addEventListener('submit', async e => {
      e.preventDefault();
      const formData = new FormData(e.target);
      let submit = formUserPassword.querySelector('.button');
      submit.textContent = 'Обновление...';
      submit.setAttribute('disabled',true);

      await updatePassword({
        passwordCurrent: formData.get('passwordCurrent'),
        password: formData.get('password'),
        passwordConfirm: formData.get('passwordConfirm')
      });

      submit.textContent = 'Сохранить пароль';
      submit.removeAttribute('disabled', true);
      formUserPassword.reset();
    });
  }
});