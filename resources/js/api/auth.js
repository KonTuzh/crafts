import Notice from '../classes/Notice';

const notice = new Notice();

const fetchApi = async (query, url, success) => {
  notice.start();
  const response = await fetch(`/api/v1/${url}`, query);
  const result = await response.json();

  if ( !(result.status === 'success') ) {
    notice.error('Ошибка!', result.message);
    return false;
  }

  notice.success(success.title, success.text);
  return result;
};

export const signup = async (data = {}) => {
  const query = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data)
  };

  const success = {
    title: 'Вы зарегистрированы!',
    text: 'Сейчас Вы будете перенаправлены на главную страницу.'
  };

  const result = await fetchApi(query, 'users/signup', success);
  if (result) window.setTimeout(() => { location.assign('/') }, 1500);
};

export const login = async (email, password) => {
  const query = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ email, password })
  };

  const success = {
    title: 'Вы авторизованы!',
    text: 'Обновление информации...'
  };

  const result = await fetchApi(query, 'users/login', success);
  if (result) {
    console.log(location);
    if (location.pathname === '/auth/login') {
      window.setTimeout(() => { location.assign('/') }, 1500);
    } else {
      location.reload(true);
    }
  }
};

export const emailExists = async email => {
  const query = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ email })
  };
  const response = await fetch('/api/v1/users/email-exists', query);
  const result = await response.json();
  return result.data;
};

export const logout = () => {
  fetch('/api/v1/users/logout')
  .then(res => location.replace = '/');
};

export const forgotPassword = async email => {
  const query = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ email })
  };

  const success = {
    title: 'Выполнено!',
    text: 'Ссылка для сброса пароля выслана на указанный Email.'
  };

  await fetchApi(query, 'users/pass/forgot', success);
};

export const resetPassword = async (data = {}) => {
  const query = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ password: data.p, passwordConfirm: data.pc })
  };

  const success = {
    title: 'Новый пароль задан!',
    text: 'Сейчас Вы будете перенаправлены на страницу авторизации'
  };

  const result = await fetchApi(query, `users/pass/reset/${data.token}`, success);
  if (result) window.setTimeout(() => { location.assign('/auth/login') }, 1500);
};
