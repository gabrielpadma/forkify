class SearchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    return this._parentEl.querySelector('.search__field').value;
  }

  addHandlerSearch(eventFn) {
    this._parentEl.addEventListener('submit', e => {
      e.preventDefault();

      eventFn();
    });
  }
}

export default new SearchView();
