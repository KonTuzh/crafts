/* eslint-disable */
import PNotify from 'pnotify/dist/es/PNotify.js';

const copyLink = (text) => {
  if (window.clipboardData && window.clipboardData.setData) {
    return clipboardData.setData("Text", text);
  }

  if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      PNotify.success({text: 'Ссылка скопирована!'});
      return;
    } catch (ex) {
      console.warn("Ошибка копирования ссылки:", ex);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

export default class Trigger {
  constructor(elem) {
    this._elem = elem;
    elem.onclick = this.onClick.bind(this);
  }

  updateCookieFilter(element) {
    if (element.classList.contains('active')) {
      document.cookie = 'filter--show=true; path=/; max-age=86400';
      return;
    }
    document.cookie = 'filter--show=false; path=/; max-age=86400';
  }

  toggleClassActive(element) {
    if (element.classList.contains('active')) {
      element.classList.remove('active');
    } else {
      element.classList.add('active');
    }
    return element;
  }

  toggleHTMLDataAttribute(element) {
    if (element.classList.contains('active')) {
      document.querySelector('html').setAttribute('data-active', element.id);
    } else {
      document.querySelector('html').removeAttribute('data-active', element.id);
    }
  }

  filterShow(element) {
    const target = this.toggleClassActive(element);
    this.toggleHTMLDataAttribute(target);
    this.updateCookieFilter(target);
  }

  filterClose(element) {
    element.classList.remove('active');
    document.querySelector('html').removeAttribute('data-active', element.id);
    this.updateCookieFilter(element);
  }

  pageMenuShow(element) {
    element.classList.add('active');
    document.querySelector('html').setAttribute('data-active', element.id);
  }

  pageMenuClose(element) {
    element.classList.remove('active');
    document.querySelector('html').removeAttribute('data-active', element.id);
  }

  userMenuToggle(element) {
    this.toggleClassActive(element);
  }

  openSharerModal(element) {
    element.classList.add('overlay--visible');
    element.addEventListener('click', this.onSharerModalClick);
  }

  onSharerModalClick(event) {
    const eventTarget = event.target;
    const overlay = eventTarget.closest('.overlay');
    const close = eventTarget.closest("button[data-action='closeModal']");
    const copy = eventTarget.closest("button[data-action='copyLink']");

    if ( (eventTarget === overlay) || close) {
      overlay.classList.remove('overlay--visible');
      overlay.removeEventListener('click', this.onSharerModalClick);
      return;
    }

    if (copy) {
      const link = copy.dataset.link;
      copyLink(link);
      return;
    }
  }

  triggerDefinition(element) {
    const targetElem = element.dataset.target;
    const actionName = element.dataset.action;
    if (!targetElem && !actionName) return false;

    const target = document.querySelector(targetElem);
    if (!target) return false;

    return {
      element: target,
      action: actionName
    }
  }

  onClick(event) {
    const eventTarget = event.target;
    const trigger = eventTarget.closest('.js-trigger');
    if (!trigger) return;

    const target = this.triggerDefinition(trigger);
    if (!target) return;

    const f = target.action;
    if (f) this[f](target.element);
  }
}

// module.exports = Trigger;