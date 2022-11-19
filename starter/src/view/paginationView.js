import icons from 'url:../img/icons.svg';
import View from './view.js';
class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(Fn) {
    this._parentEl.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      return Fn(goToPage);
    });
  }

  _generateMarkup() {
    const totalNumPages = Math.ceil(
      this._data.result.length / this._data.resultsPage
    );

    if (this._data.curPage === 1 && totalNumPages > 1) {
      //kl total halaman lbh dari 1 && lg di page 1
      return `<button data-goto="${
        this._data.curPage + 1
      }" class="btn--inline pagination__btn--next">
      <span>Page ${this._data.curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }

    // console.log(numPages, this._data.result.length);
    //if there are other pages
    //last page
    if (this._data.curPage === totalNumPages && totalNumPages > 1) {
      return ` <button data-goto="${
        this._data.curPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${this._data.curPage - 1}</span>
    </button>`;
    }

    if (this._data.curPage < totalNumPages) {
      return ` <button data-goto="${
        this._data.curPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${this._data.curPage - 1}</span>
    </button> 
    <button data-goto="${
      this._data.curPage + 1
    }" class="btn--inline pagination__btn--next">
    <span>Page ${this._data.curPage + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>`;
    }

    return ``;
  }
}

export default new PaginationView();
