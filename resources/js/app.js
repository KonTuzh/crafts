/* eslint-disable */
import Notice from './classes/Notice';

import Embedo from 'embedo';
import LazyLoad from "vanilla-lazyload";
import Sharer from 'sharer.js';

import { jsTriggerInit } from "./trigger-init";
import Filter from './classes/Filter';
import { popularPostsSlider } from "./glide-init";

jsTriggerInit();
popularPostsSlider();

require('./_scroll-page');
require('./_authorization');
require('./_cabinet-profile');
require('./_comments');

document.addEventListener('DOMContentLoaded', function() {
  const formSearch = document.querySelector('form#search');
  const categoriesDropdown = document.querySelector('#categories-dropdown');
  const btnsFavorite = document.querySelectorAll('.button--favorite');
  const filter = document.querySelector('#page-filter');
  const singleContent = document.querySelector('.single__content');
  const singleVideoContent = document.querySelector('.single--video .single__content');

  const notice = new Notice();

  if (singleVideoContent) headerInsertBeforeVideo(singleVideoContent);
  if (singleContent) registerView(singleContent);

  function registerView(article) {
    const postId = article.querySelector('.button--favorite').dataset.post;
    const query = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' }
    }

    fetch(`/api/v1/posts/${postId}/views`, query)
    .then(response => response.json())
    .then(result => {
      if ( !(result.status === 'success') ) return;
      const views = article.querySelector('.badge--views .count');
      views.innerText = result.data;
    });
  }

  function headerInsertBeforeVideo(article) {
    const fragment = document.createDocumentFragment();
    const header = article.querySelector('.single__header');
    const line = article.querySelector('.line');
    const body = article.querySelector('.single__body');
    const media = body.querySelector('.media');
    fragment.appendChild(header);
    body.insertBefore(fragment, media.nextSibling);
    body.insertBefore(line, header.nextSibling);
  }

  const embedo = new Embedo({
    twitter: true,
    instagram: true,
    pinterest: true
  });

  document.querySelectorAll( 'oembed[url]' ).forEach(element => {
    embedo.load(element, element.attributes.url.value );
  });

  var lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy",
    to_webp: true,
    callback_error: element => {
      element.src = "data:image/gif;base64,R0lGODlhAgABAIAAAP///wAAACH5BAEAAAEALAAAAAACAAEAAAICTAoAOw==";
    }
  });

  const getPostsForCategory = async (catID = '') => {
    const url = `/api/v1/render/home?category=${catID}&limit=9`;
    const total = await updatePostsList(url);
    if (total === undefined) return null;
    return total;
  };

  const updatePostsList = (url = '/api/v1/render/search') => {
    return fetch(url)
    .then(response => response.json())
    .then(result => {
      if (!(result.status === 'success'))
        throw Error('Ошибка обращения к серверу. Обновите страницу и попробуйте еще раз.');

      document.querySelector('#posts').innerHTML = result.data;
      const favorite = document.querySelectorAll('.button--favorite');

      if (lazyLoadInstance) lazyLoadInstance.update();

      if (favorite.length > 0)
        favorite.forEach(function(element) {
          element.addEventListener('click', onButtonFavoriteClick);
        });

      return result.total;
    })
    .catch(error => notice.pnotify('error', { title: 'Ошибка!', text: error}));
  };

  if (filter) {
    var FilterInstance = new Filter(filter, filterParams, updatePostsList);
  }

  // Search Form
  if (formSearch) {
    const searchInput = document.querySelector('#search-value');
    searchInput.onfocus = function() {
      formSearch.classList.add('focus');
    };
    searchInput.onblur = function() {
      formSearch.classList.remove('focus');
    };
    searchInput.addEventListener('input', e => {
      if (e.target.value) {
        console.log(e.target.value);
        if (!formSearch.classList.contains('active'))
          formSearch.classList.add('active');
        return;
      }
      formSearch.classList.remove('active');
    });
  }

  // Select Category and Show Posts
  if (categoriesDropdown) {
    categoriesDropdown.addEventListener('click', onDropdownClick);
    const categoriesSelect = categoriesDropdown.querySelector('#categories-select');
    if (categoriesSelect) {
      categoriesSelect.addEventListener('change', event => {
        const catID = event.target.options[event.target.selectedIndex].value;
        getPostsForCategory(catID);
      });
    }
  }

  function onDropdownClick(event) {
    const button = event.target.closest('.dropdown__button');

    if (button && button.classList.contains('active')) {
      button.classList.remove('active');
      return;
    }

    if (button && !button.classList.contains('active')) {
      button.classList.add('active');
      return;
    }

    const item = event.target.closest('li');
    if (!item) return;

    const dropdown = event.target.closest('.dropdown');
    const btn = dropdown.querySelector('.dropdown__button');
    const select = dropdown.querySelector('.dropdown__select');
    btn.classList.remove('active');
    btn.innerText = item.innerText;

    select.selectedIndex = -1;

    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].value === item.dataset.value) {
        select.selectedIndex = i;
        select.dispatchEvent(new Event('change'));
        break;
      }
    }
  }

  // if click button add Post to favorites
  if (btnsFavorite.length > 0) {
    btnsFavorite.forEach(function(element) {
      element.addEventListener('click', onButtonFavoriteClick);
    });
  }

  async function onButtonFavoriteClick(event) {
    const btn = event.target.closest('.button--favorite');
    if (!btn) return;

    const post = btn.dataset.post;
    const user = btn.dataset.user;
    const like = btn.dataset.like;

    if (!post) return;

    if (!user) {
      document.querySelector('#signup-overlay').classList.add('overlay--visible');
      return;
    }

    if (like) {
      await deleteLike( { like, user, post }, btn );
      return;
    }

    await createLike( { post, user }, btn );
  }

  const createLike = (data, btn) => {
    const query = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json;charset=utf-8' }
    }
    notice.start();
    return fetch(`/api/v1/posts/${data.post}/likes`, query)
    .then(response => response.json())
    .then(result => {
      if (result.status === 'success') {
        const newLike = result.data.data;
        const article = document.getElementById(newLike.post);
        const badgeLikes = article.querySelector('.badge--likes .count');
        const likes = parseInt(badgeLikes.innerText, 10);

        notice.success(null, 'Статья добавлена в избранное');

        btn.classList.add('active');
        btn.setAttribute('data-like', newLike.id);
        badgeLikes.innerText = likes + 1;

        return true;
      }
      notice.error('Ошибка!', result.message);
    });
  }

  const deleteLike = (data, btn) => {
    const query = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json;charset=utf-8' }
    }
    notice.start();
    return fetch(`/api/v1/likes/${data.like}`, query)
    .then(response => {
      if (response.status === 204) {
        const article = document.getElementById(data.post);
        const badgeLikes = article.querySelector('.badge--likes .count');
        const likes = parseInt(badgeLikes.innerText, 10);

        notice.info(null, 'Статья удалена из избранного');

        btn.classList.remove('active');
        btn.removeAttribute('data-like', data.like);
        badgeLikes.innerText = likes - 1;

        return true;
      }
      notice.error('Ошибка!', response.json().message);
    });
  }
});
