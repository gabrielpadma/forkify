import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from '../view/recipeView.js';
import searchView from '../view/searchView.js';
import resultView from '../view/resultView.js';
import paginationView from '../view/paginationView.js';
import bookmarksView from '../view/bookmarkView.js';
import addRecipeView from '../view/addRecipeView.js';

// if (module.hot) {
//   module.hot.accept();
// }

const getApiResult = async () => {
  //same as controlRecipe
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    resultView.updateUi(model.searchPagination());

    //loading the content
    await model.loadRecipe(id);
    bookmarksView.render(model.state.bookmarks);
    bookmarksView.updateUi(model.state.bookmarks);
    const { recipe } = model.state;
    //rendering the content
    recipeView.render(recipe);
  } catch (e) {
    //di throw kl internet mati waktu data fetching
    console.error(e);
    recipeView.dispErr(e);
  }
};

const controlSearchResult = async () => {
  try {
    resultView.renderSpinner();
    const data = searchView.getQuery(); //if no value inputed
    if (!data) return;
    await model.loadSearchResult(data);
    if (model.state.search.result.length === 0)
      //if there are no recipes throw sum shit
      throw new Error('Kamu nanya kok resep nya gk ada');
    //rendering the content

    resultView.render(model.searchPagination()); //1 as default when invoked first time
    paginationView.render(model.state.search);
  } catch (e) {
    console.error(e);
    resultView.dispErr(e);
  }
};

const controlPagination = Page => {
  resultView.render(model.searchPagination(Page));
  paginationView.render(model.state.search);
};

const updateServing = newServing => {
  //same as control servings
  if (newServing < 1) return;
  //recipeView.render(model.updateServing(newServing));
  recipeView.updateUi(model.updateServing(newServing));
};

const controlAddBookmarks = () => {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.state.recipe.bookmarked = false;
    model.deleteBookmark(model.state.recipe.id);
  }
  recipeView.updateUi(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async formData => {
  try {
    addRecipeView.renderSpinner();
    const data = Object.fromEntries(formData);
    await model.uploadRecipe(data);
    console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
    //disp success msg after inputing the new recipe
    addRecipeView.dispSuccess();
    //render the bookmark
    bookmarksView.render(model.state.bookmarks);
    window.history.pushState(null, '', `${model.state.recipe.id}`);
    setTimeout(() => {
      addRecipeView.toggle();
    }, 1000);
  } catch (e) {
    console.error(e);
    addRecipeView.dispErr(e);
  }
};

const init = function () {
  recipeView.addHandlerRender(getApiResult); //when page first load and hash changes
  recipeView.addHandlerUpdateServing(updateServing); // if user clicks servings button
  searchView.addHandlerSearch(controlSearchResult); // if user submit data in search form
  paginationView.addHandlerClick(controlPagination); //if user clicks pagination button
  recipeView.addHandlerBookmark(controlAddBookmarks); //if user clicks bookmark button
  addRecipeView.addHandlerShowWindow(); //if user clicks add new Recipe
  addRecipeView.addHandleCloseWindow(); //if user clicks closeWindow
  addRecipeView.addHandlerUpload(controlAddRecipe); //if user submit a new recipe
};
init();

///////////////////////////////////////
