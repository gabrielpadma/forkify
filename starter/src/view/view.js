import icons from 'url:../img/icons.svg';
export default class View {
  /**
   *
   * @param {*} data
   * @param {*} render
   * @returns
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.dispErr();
    this._data = data;
    // console.log(data);
    const html = this._generateMarkup();
    if (!render) return html;
    this._clearHtml();
    this._parentEl.insertAdjacentHTML('afterbegin', html);
  }

  updateUi(data) {
    this._data = data;
    const html = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(html); //create virtual DOM
    const newEl = Array.from(newDom.querySelectorAll('*')); //elements from virtual DOM
    const curEl = Array.from(this._parentEl.querySelectorAll('*')); // elements from the curr DOM
    newEl.forEach((val, i) => {
      const realEl = curEl[i];
      if (!val.isEqualNode(realEl) && val.firstChild?.nodeValue.trim() !== '') {
        realEl.textContent = val.textContent;
      }

      if (!val.isEqualNode(realEl)) {
        Array.from(val.attributes).forEach(val =>
          realEl.setAttribute(val.name, val.value)
        );
      }
    });
  }

  _clearHtml() {
    this._parentEl.innerHTML = '';
  }

  renderSpinner() {
    const html = `<div class="spinner">
        <svg>
        <use href="${icons}#icon-loader"></use>
        </svg>
        </div>`;
    this._parentEl.innerHTML = '';
    this._parentEl.insertAdjacentHTML('afterbegin', html);
  }

  dispErr(msg = this.errMsg) {
    const html = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${msg}</p>
  </div> `;
    this._clearHtml();
    this._parentEl.insertAdjacentHTML('afterbegin', html);
  }
  dispSuccess(msg = this._msg) {
    const html = `<div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${msg}</p>
  </div> `;
    this._clearHtml();
    this._parentEl.insertAdjacentHTML('afterbegin', html);
  }
}
