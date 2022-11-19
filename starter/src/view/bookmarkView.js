import icons from 'url:../img/icons.svg';
import View from './view.js';
import PreviewView from './previewView';
class BookmarksView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  errMsg = `Kamu Nanya! Bookmark nya gk ada`;
  msg = `Kamu Benar Benar Bertanya`;

  _generateMarkup() {
    return this._data.map(val => PreviewView.render(val, false)).join('');
  }
}
export default new BookmarksView();
