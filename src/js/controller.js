import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// alert('hi');

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// if (module.hot) module.hot.accept();

//-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/
//
//  main recipe
//
//-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/
const controlRecipe = async () => {
  try {
    // -0-
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());

    // --1-- loading recipe
    await model.loadRecipe(id);

    //--2-- rendering recipe
    recipeView.render(model.state.recipe);

    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    // alert(err);
    recipeView.renderError();
    console.error(err);
  }
};

// controlRecipe();

//-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/
//
// search results
//
//-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/
const controlSearchResults = async () => {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResult(query);

    // console.log(model.state.search.results);

    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = goToPage => {
  //to render new values
  resultsView.render(model.getSearchResultsPage(goToPage));

  paginationView.render(model.state.search);
};

const controlServings = newServings => {
  model.updateServings(newServings);
  // console.log(newServings, model.updateServings(newServings));

  recipeView.update(model.state.recipe);
  // console.log(model.state.recipe);
};

const controlAddBookmark = () => {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // console.log(model.state.recipe.bookmarked);
  // console.log(model.state.recipe);

  recipeView.update(model.state.recipe);
  // console.log(
  //   model.state,
  //   model.state.bookmarks,
  //   bookmarksView.render(model.state.bookmarks)
  // );

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    //     // Render recipe
    recipeView.render(model.state.recipe);
    //     // Success message
    addRecipeView.renderMessage();
    //     // Render bookmark view
    bookmarksView.render(model.state.bookmarks);
    //     // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //     // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};
// controlSearchResults();
// --/--/--/--/--/--/--/--/--/--/--/--/--/--/--/--/--/--/--/--/--//

// --/--/--/--/--/--/--/--/--/--/--/--/--/--/--/--/--/--/--/--/--//
// const init = () => {
//   recipeView.addHandlerRender(controlRecipe);
// };

// init();

// immediately executing a function
const init = (() => {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
})();
