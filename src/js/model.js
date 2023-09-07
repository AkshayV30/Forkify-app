// Import necessary modules and constants
import { async } from 'regenerator-runtime'; // For asynchronous code
import { API_URL, RES_PER_PAGE, KEY } from './config.js'; // Importing constants
import { AJAX } from './helper.js'; // Import a helper function for making AJAX requests

// Define the state object to manage application data
export const state = {
  recipe: {}, // Currently displayed recipe
  search: {
    query: '', // Current search query
    page: 1, // Current page of search results
    results: [], // Array to store search results
    resultsPerPage: RES_PER_PAGE, // Number of results to display per page
  },
  bookmarks: [], // Array to store bookmarked recipes
};

// Helper function to create a recipe object from API data
const createRecipeObject = data => {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    imageUrl: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // Include 'key' property if it exists
  };
};

// Function to load a recipe by ID
export const loadRecipe = async function (id) {
  try {
    // Make an AJAX request to load the recipe
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    // Create a recipe object from the received data
    state.recipe = createRecipeObject(data);

    // Check if the recipe is bookmarked
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    // Handle errors
    throw error;
  }
};

// Function to load search results
export const loadSearchResult = async query => {
  try {
    state.search.query = query;
    const searchData = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    // Extract and format search results
    state.search.results = searchData.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        imageUrl: rec.image_url,
      };
    });

    state.search.page = 1; // Reset the current page
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

// Function to get a specific page of search results
export const getSearchResultsPage = (page = state.search.page) => {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // Calculate the start index
  const end = page * state.search.resultsPerPage; // Calculate the end index

  return state.search.results.slice(start, end); // Return the results for the current page
};

// Function to update servings in a recipe
export const updateServings = newServings => {
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

// Function to add a recipe to bookmarks
export const addBookmark = recipe => {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // Persist bookmarks to local storage
  persistBookmarks();
};

// Function to delete a bookmarked recipe by ID
export const deleteBookmark = id => {
  const index = state.bookmarks.findIndex(el => {
    el.id === id;
  });
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  // Persist bookmarks to local storage
  persistBookmarks();
};

// Function to persist bookmarks to local storage
const persistBookmarks = () => {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// Initialization function to load bookmarks from local storage
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

// Function to clear bookmarks from local storage (not currently used)
const clearBookmarks = () => {
  localStorage.clear('bookmarks');
};

// Function to upload a new recipe to the API
export const uploadRecipe = async function (newRecipe) {
  try {
    // Extract and format ingredients from the new recipe
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // Create a recipe object
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // Make an AJAX request to upload the new recipe
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    console.log(data);

    // Create a recipe object from the received data
    state.recipe = createRecipeObject(data);

    // Add the new recipe to bookmarks
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
