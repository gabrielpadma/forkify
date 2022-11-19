import icons from 'url:../img/icons.svg';
import View from './view.js';
class AddRecipeView extends View {
  _errMsg = `Kamu Nanya!`;
  _msg = `Kamu berhasil bertanya`;
  _parentEl = document.querySelector('.upload');

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _generateMarkup() {}
  toggle() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', () => {
      this.toggle();
    });
  }

  addHandleCloseWindow() {
    this._btnClose.addEventListener('click', () => {
      this.toggle();
    });
  }

  addHandlerUpload(Fn) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = [...new FormData(this)];
      Fn(data);
    });
  }
}

export default new AddRecipeView();
