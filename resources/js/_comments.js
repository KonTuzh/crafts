/* eslint-disable */
import Notice from './classes/Notice';

document.addEventListener('DOMContentLoaded', function() {
  const commentsForm = document.querySelector('.comments__form');
  const notice = new Notice();

  const sendComment = async (data, postId) => {
    const query = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(data)
    };

    notice.start();
    const response = await fetch(`/api/v1/posts/${postId}/comments/add`, query);
    const result = await response.json();

    if ( !(result.status === 'success') ) {
      notice.error('Ошибка!', result.message);
      return null;
    }

    notice.success('Комментарий отправлен!', 'Он будет доступен всем посетителям после проверки модератором.');
    return result.data.data;
  };

  const openAuthModal = () => {
    const authModal = document.querySelector('#signup-overlay');
    authModal.classList.add('overlay--visible');
  };

  const createComment = comment => {
    const userName = comment.owner.lastName 
      ? `${comment.owner.firstName} ${comment.owner.lastName}`
      : comment.owner.firstName;
    const html = `
      <div class="comments__item">
        <div class="avatar">
          <picture>
            <source type="image/webp" srcset="images/users/${comment.owner.photo}_500.webp 500w">
            <img src="images/users/${comment.owner.photo}_150.jpeg" alt="${userName}" srcset="images/users/${comment.owner.photo}_150.jpeg 1x, images/users/${comment.owner.photo}_300.jpeg 2x, images/users/${comment.owner.photo}.jpeg 3x">
          </picture>
        </div>
        <div class="info">
          <p class="published"><a class="name" href="user/${comment.owner._id}" target="__blank">${userName}</a> <span class="date">на модерации</span></p>
          <p class="text">${comment.text}</p>
        </div>
      </div>`;

    const fragmentFromString = function (strHTML) {
      return document.createRange().createContextualFragment(strHTML);
    }
    const commentsList = document.querySelector('.comments__list');
    const fragment = fragmentFromString(html);
    commentsList.prepend(fragment);
  };

  if (commentsForm) {
    commentsForm.addEventListener('click', event => {
      const trigger = event.target.closest('form');
      const userId = trigger.dataset.user;
      if (!userId) openAuthModal();
      return;
    });

    commentsForm.addEventListener('submit', async event => {
      event.preventDefault();
      const userId = event.target.dataset.user;

      if (!userId) {
        openAuthModal();
        return;
      }

      const postId = event.target.dataset.post;
      const formData = new FormData(event.target);
      const comment = await sendComment({ text: formData.get('text'), _csrf: formData.get('_csrf') }, postId);

      if (comment) {
        createComment(comment);
      }
    });
  }
});
