/* eslint-disable */
import Notice from './classes/Notice';
import Taggle from 'taggle';

Taggle;

document.addEventListener('DOMContentLoaded', function() {
  const formPost = document.querySelector('#form-post');
  const formCategory = document.querySelector('#form-category');
  const inputNumber = document.querySelector('.number');
  const buttonDelete = document.querySelector('.button__delete');

  const notice = new Notice();

  let editor;
  InlineEditor.create(document.querySelector('#editor'), {
    simpleUpload: {
      uploadUrl: '/api/v1/posts/upload-images',
      // headers: {
      //     'X-CSRF-TOKEN': 'CSFR-Token',
      //     Authorization: 'Bearer <JSON Web Token>'
      // }
  }
  }).then(newEditor => {
    editor = newEditor;
  }).catch(error => {
    console.error(error);
  });

  if (document.querySelector('#keywords')) {
    var taggle = new Taggle('keywords', {
      tags: postKeywords,
      duplicateTagClass: 'bounce',
      hiddenInputName: 'keywords',
      placeholder: 'Введите ключевые слова...'
    });
  }

  const deleteOne = (url, redirect) => {
    const query = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    }
    notice.start();
    return fetch(`/api/v1/${url}`, query)
    .then(response => {
      if ( response.status === 204 ) {
        notice.success('Выполнено!', 'Запись успешно удалена.');
        window.setTimeout(() => { location.assign(redirect) }, 1500);
        return;
      }
      notice.error('Ошибка!', response.json().message);
    });
  }

  const create = (data, url) => {
    const query = {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    }
    notice.start();
    return fetch(`/api/v1/${url}`, query)
    .then(response => response.json())
    .then(result => {
      if ( !(result.status === 'success') ) {
        notice.error('Ошибка!', result.message);
        return null;
      }
      notice.success('Выполнено!', 'Запись успешно создана.');
      return result;
    });
  }

  const update = (data, url) => {
    const query = {
      method: 'PATCH',
      body: data,
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    }
    notice.start();
    return fetch(`/api/v1/${url}`, query)
    .then(response => {
      if ( response.status === 204 ) {
        notice.success('Выполнено!', 'Запись успешно обновлена.');
        return;
      }
      notice.error('Ошибка!', response.json().message);
    });
  }

  const uploadImages = (data, url) => {
    const query = {
      method: 'POST',
      body: data
    }
    notice.start();
    return fetch(`/api/v1/${url}`, query)
    .then(response => response.json())
    .then(result => {
      if ( !(result.status === 'success') ) {
        const errors = result.error.errors;
        if (errors === undefined) {
          notice.error('Ошибка!', result.message);
          return null;
        }
  
        if (errors.cover) {
          notice.error('Ошибка!', errors.cover.message);
        } else if (errors.galery) {
          notice.error('Ошибка!', errors.galery.message);
        } else {
          notice.error('Ошибка!', result.message);
        }
        return null;
      }
      notice.success('Выполнено!', 'Изображение успешно загружено.');
      return result;
    });
  }

  if (buttonDelete) {
    buttonDelete.addEventListener('click', onButtonDeleteClick);
  }

  if (inputNumber) {
    inputNumber.addEventListener('click', onInputNumberClick);
  }

  if (formPost) {
    const inputFileCover = formPost.querySelector('#cover');
    const inputFileGalery = formPost.querySelector('#galery');

    inputFileCover.addEventListener('change', async e => {
      if (e.target.files && e.target.files[0]) {
        onChangeCover(formPost, 'posts', 'posts/upload-post-images');
      }
    });

    if (inputFileGalery) {
      inputFileGalery.addEventListener('change', async e => {
        const formData = new FormData();
        for (let file of e.target.files) {
          formData.append('galery', file);
        }
        formData.append('id', formPost.querySelector('#post-id').value);
        const img = await uploadImages(formData, 'posts/upload-post-images');
        const galeryList = formPost.querySelector('.galery__list');
        const newGaleryList = document.createElement('div');
        newGaleryList.classList.add('galery__list');
        img.galery.forEach(src => {
          const oImg = document.createElement('img');
          oImg.classList.add('galery__item');
          oImg.src = `images/uploads/${src}${img.size}`;
          newGaleryList.appendChild(oImg);
        });
        galeryList.parentNode.replaceChild(newGaleryList, galeryList);
      });
    }


    formPost.addEventListener('submit', async event => {
      event.preventDefault();
      let formData;
      let data;

      try {
        formData = getFormData(event.target);
      } catch (error) {
        notice.pnotify('error', { title: 'Ошибка!', text: 'URL записи не валиден'});
      }

      const oldStatus = trigger.dataset.status;
      const newStatus = formData.get('status');

      if (oldStatus !== newStatus && newStatus === 'published') {
        formData.set('publishedAt', Date.now());
      }

      data = formToJSON(formData);

      if (formData.get('id')) {
        await update(data, `posts/${formData.get('id')}`);
      } else {
        await create(data, 'posts');
      }
    });
  }

  if (formCategory) {
    const inputFileCover = formCategory.querySelector('#cover');

    inputFileCover.addEventListener('change', async e => {
      if (e.target.files && e.target.files[0]) {
        onChangeCover(formCategory, 'categories', 'categories/upload-cover');
      }
    });

    formCategory.addEventListener('submit', async event => {
      event.preventDefault();
      let formData;
      let data;

      try {
        formData = getFormData(event.target);
        data = formToJSON(formData);
      } catch (error) {
        notice.pnotify('error', { title: 'Ошибка!', text: 'URL записи не валиден'});
      }

      if (formData.get('id')) {
        await update(data, `categories/${formData.get('id')}`);
      } else {
        await create(data, 'categories');
      }
    });
  }

  async function onButtonDeleteClick(event) {
    const eventTarget = event.target;
    const trigger = eventTarget.closest('button');
    const id = trigger.dataset.id;
    const model = trigger.dataset.type;
    if (id && model) {
      await deleteOne(`${model}/${id}`, `/${model}`);
    }
    return;
  }

  function getFormData(form) {
    const formData = new FormData(form);
    const postCover = form.querySelector('#post-cover');
    formData.set('cover', postCover.dataset.cover);
    formData.set('content', editor.getData());

    if (formData.has('publishedAt') && formData.get('status') !== 'published') {
      formData.delete('publishedAt');
    }

    if (formData.has('slug')) {
      if (!formData.get('slug').match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))
        throw new Error('URL не валиден');
    }

    return formData;
  }

  async function onChangeCover(form, folder, url) {
    let postCover = form.querySelector('#post-cover');
    const formData = new FormData(form);
    const img = await uploadImages(formData, url);
    if (img.cover) {
      postCover.setAttribute('src', `images/${folder}/${img.cover}${img.size}`);
      postCover.dataset.cover = img.cover;
    }
  }

  function formToJSON(data) {
    let output = {};
    data.forEach((value, key) => {
        if (Object.prototype.hasOwnProperty.call(output, key)) {
          let current = output[key];
          if ( !Array.isArray(current) ) {
            current = output[key] = [current];
          }
          current.push(value);
        } else {
          output[key] = value;
        }
      }
    );
    return JSON.stringify(output);
  }

  function onInputNumberClick(event) {
    const eventTarget = event.target;
    const decrease = eventTarget.closest('.number__button--decrease');
    const increase = eventTarget.closest('.number__button--increase');
    if (!decrease && !increase) return;

    let input = undefined;
    if (decrease) input = event.toElement.nextElementSibling;
    if (increase) input = event.toElement.previousElementSibling;
    if (input === undefined) return;

    let min = parseInt(input.min, 10);
    let max = parseInt(input.max, 10);
    let step = parseInt(input.step, 10);
    let value = parseInt(input.value, 10);
    min = isNaN(min) ? 1 : min;
    max = isNaN(max) ? 10 : max;
    step = isNaN(step) ? 1 : step;
    value = isNaN(value) ? 0 : value;

    if (decrease) {
      let stop = min + 1;
      value = value < stop ? min : value - step;
    } else if (increase) {
      let stop = max - 1;
      value = value > stop ? max : value + step;
    }

    input.value = value;
  }
});
