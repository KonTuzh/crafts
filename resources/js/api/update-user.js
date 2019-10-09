import Notice from '../classes/Notice';

const notice = new Notice();

export const updateSettings = (data = {}) => {
  const query = {
    method: 'PATCH',
    body: data
  }
  notice.start();
  fetch('/api/v1/users/update', query)
  .then(response => response.json())
  .then(result => {
    if ( !(result.status === 'success') ) {
       const errors = result.error.errors;
      if (errors === undefined) {
        notice.error('Ошибка!', result.message);
        return;
      }

      if (errors.firstName) {
        notice.error('Ошибка!', errors.firstName.message);
      } else if (errors.lastName) {
        notice.error('Ошибка!', errors.lastName.message);
      } else if (errors.email) {
        notice.error('Ошибка!', errors.email.message);
      } else if (errors.photo) {
        notice.error('Ошибка!', errors.photo.message);
      } else {
        notice.error('Ошибка!', result.message);
      }
      return;
    }
    notice.success('Выполнено!', 'Данные успешно обновлены.');
    window.setTimeout(() => {
      location.assign('/me');
    }, 1500);
  });
};

export const updatePassword = (data = {}) => {
  const query = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data)
  };
  notice.start();
  fetch('/api/v1/users/pass/update', query)
  .then(response => response.json())
  .then(result => {
    if ( !(result.status === 'success') ) {
      const errors = result.error.errors;
      if (errors === undefined) {
        notice.error('Ошибка!', result.message);
        return;
      }
      if (errors.password) {
        notice.error('Ошибка!', errors.password.message);
      } else if (errors.passwordConfirm) {
        notice.error('Ошибка!', errors.passwordConfirm.message);
      } else {
        notice.error('Ошибка!', result.message);
      }
      return;
    }
    notice.success('Выполнено!', 'Данные успешно обновлены.');
  });
};