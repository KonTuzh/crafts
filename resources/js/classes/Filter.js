/* eslint-disable */
class Filter {
  constructor(elem, params, updateFunction) {
    this._elem = elem;
    this.params = params;
    this.update = updateFunction;
    elem.onclick = this.onClick.bind(this);
  }

  onClick(event) {
    const eventTarget = event.target;
    const trigger = eventTarget.closest('label');
    const dropdownBtn = eventTarget.closest('.dropdown__button');
    const dropdownItem = eventTarget.closest('.dropdown__item');

    if (!trigger && !dropdownBtn && !dropdownItem) return;

    if (dropdownBtn) {
      this.toggleActiveClass(dropdownBtn);
      return;
    }

    if (dropdownItem) {
      const data = this.getDataTrigger(dropdownItem);
      const dropdownBtn = this._elem.querySelector('.dropdown__button');
      const itemValue = dropdownItem.innerHTML;
      dropdownBtn.innerHTML = itemValue;
      this.toggleActiveClass(dropdownBtn);
      this.replaceParams(data);
      this.pushParams(data.name, data.value);
      this.search();
    }

    if (!trigger) return;

    const data = this.getDataTrigger(trigger);

    // Checkbox click
    if (trigger.classList.contains('control--checkbox')) {
      this.toggleActiveClass(trigger);
      this.appendParams(data);
      this.pushParams(data.name, this.params[data.name].join(','));
      this.pushParams('page', 1);
      this.search();
    }

    // radio click
    if (trigger.classList.contains('control--radio')) {
      const inputs = this._elem.querySelectorAll(
        `label.active[data-field-name="${data.name}"]`
      );
      inputs.forEach(function(element) {
        element.classList.remove('active');
      });
      this.toggleActiveClass(trigger);
      this.replaceParams(data);
      this.pushParams(data.name, data.value);
      this.search();
    }

    return;
  }

  async search() {
    console.log('search() =>', this.params);
    const { pathname, search} = window.location;

    if (pathname !== '/search') {
      window.location.href = `/search${search}`;
      return;
    }

    const total = await this.update(`/api/v1/render/search${search}`);
    const text = this.correctForm(total, ['запись','записи','записей']);
    document.querySelector('.total-count').innerHTML = `${total} ${text}`;
  }

  pushParams(key, value) {
    key = encodeURI(key);
    value = encodeURI(value);
    // console.log('pushParams() =>', { key, value });
    const { href, pathname, search} = window.location;
    let params = new URLSearchParams(search.slice(1));

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    window.history.pushState({ path: href }, '', `${pathname}?${params.toString()}`);
  }

  toggleActiveClass(element) {
    element.classList.contains('active')
      ? element.classList.remove('active')
      : element.classList.add('active');
  }

  appendParams(data) {
    if (this.params[data.name]) {
      const values = this.params[data.name];

      if (values.indexOf(data.value) !== -1) {
        values.splice(values.indexOf(data.value), 1);
      } else {
        values.push(data.value);
        this.params[data.name] = values;
      }
    } else {
      this.params[data.name] = [data.value];
    }
  }

  replaceParams(data) {
    this.params[data.name] = data.value;
  }

  getDataTrigger(element) {
    if (!element.dataset.fieldName && !element.dataset.value) return false;

    const data = {
      name: element.dataset.fieldName,
      value: element.dataset.value
    };

    console.log('getDataTrigger() =>', data);

    return data;
  }

  correctForm(number, suffix) {
    const keys = [2, 0, 1, 1, 1, 2];
    const mod = number % 100;
    const suffixKey = mod > 7 && mod < 20 ? 2 : keys[Math.min(mod % 10, 5)];
    return suffix[suffixKey];
  }
}

export default Filter;
// module.exports = Filter;