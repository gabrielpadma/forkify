import { API_URL } from './config.js';
import { API_KEY } from './config.js';
import { PER_PAGE } from './config.js';
import { AJAX } from '../Helper/helper.js';

const state = {
  recipe: {},
  search: { query: '', result: [], resultsPage: PER_PAGE, curPage: 1 },
  bookmarks: [],
};

const createRecipeObj = data => {
  let { recipe: recipe1 } = data.data;
  return {
    id: recipe1.id,
    title: recipe1.title,
    publisher: recipe1.publisher,
    sourceUrl: recipe1.source_url,
    image: recipe1.image_url,
    servings: recipe1.servings,
    cookingTime: recipe1.cooking_time,
    ingredients: recipe1.ingredients,
    ...(recipe1.key && { key: recipe1.key }),
  };
};

const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}${API_KEY}`);
    state.recipe = createRecipeObj(data);

    if (state.bookmarks.some(b => b.id === id)) {
      //re setting the bookmarked obj if user load the page again
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (e) {
    throw e;
    //alert(e);
  }
};
const loadSearchResult = async query => {
  try {
    state.search.query = query;

    const data = await AJAX(
      `https://forkify-api.herokuapp.com/api/v2/recipes?search=${query}&key=15bec860-f784-49e1-8519-e080d209d107`
    );
    state.search.result = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.curPage = 1;
  } catch (e) {
    throw e;
  }
};

const searchPagination = (page = state.search.curPage) => {
  //same as getResultPage
  state.search.curPage = page;
  const start = (page - 1) * state.search.resultsPage; //when the func invoked for the first time its start at index 0
  const end = page * state.search.resultsPage; //when the func invoked for the first time its end at index 10
  return state.search.result.slice(start, end);
};

const updateServing = newServing => {
  state.recipe.ingredients.forEach(val => {
    val.quantity = (val.quantity * newServing) / state.recipe.servings;
    //new Qt=oldQt*newServing/oldServ
  });
  state.recipe.servings = newServing;

  return state.recipe;
};

const addBookmark = recipe => {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

const deleteBookmark = id => {
  state.bookmarks.splice(
    state.bookmarks.findIndex(val => val.id === id),
    1
  );
  persistBookmarks();
};

const persistBookmarks = () => {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const init = () => {
  const storage = JSON.parse(localStorage.getItem('bookmarks'));
  if (storage) state.bookmarks = storage;
};

const uploadRecipe = async newRecipe => {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(el => {
        return el[0].startsWith('ingredient') && el[1] !== '';
      })
      .map(val => {
        const ingArr = val[1].split(',').map(val => val.trim());
        // const ingArr = val[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3) throw new Error(`Wrong Format !!!`);

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}${API_KEY}`, recipe);
    state.recipe = createRecipeObj(data);
    addBookmark(state.recipe);
  } catch (e) {
    throw e;
  }
};

init();
export {
  state,
  loadRecipe,
  loadSearchResult,
  searchPagination,
  updateServing,
  addBookmark,
  deleteBookmark,
  persistBookmarks,
  uploadRecipe,
};
