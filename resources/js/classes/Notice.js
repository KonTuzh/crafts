import PNotify from 'pnotify/dist/es/PNotify';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons.js';
import PNotifyStyleMaterial from 'pnotify/dist/es/PNotifyStyleMaterial.js';

PNotify.defaults.styling = 'material';
PNotify.defaults.icons = 'material';

export default class Notice {
  constructor() {
    this.notice = null;
    this.started = {
      text: 'Обработка...',
      icon: false,
      hide: false,
      shadow: false,
      width: '200px',
      modules: {
        Buttons: { closer: false, sticker: false }
      }
    };
    this.updated = {
      icon: true,
      hide: true,
      shadow: true,
      width: PNotify.defaults.width,
      modules: {
        Buttons: { closer: true, sticker: true }
      }
    };
  }

  pnotify(type, data) {
    PNotify[type](data);
  }

  start() {
    this.notice = PNotify.info(this.started);
  }

  error(title, text) {
    if (title) this.updated.title = title;
    if (text) this.updated.text = text;
    this.updated.type = 'error';
    this.notice.update(this.updated);
  }

  success(title, text) {
    if (title) this.updated.title = title;
    if (text) this.updated.text = text;
    this.updated.type = 'success';
    this.notice.update(this.updated);
  }

  info(title, text) {
    if (title) this.updated.title = title;
    if (text) this.updated.text = text;
    this.updated.type = 'info';
    this.notice.update(this.updated);
  }
}