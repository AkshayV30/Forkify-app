// Importing icons from a specific URL
import icons from 'url:../../img/icons.svg';

// Exporting a class named 'View'
export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [r=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Akshay V30
   * @todo Finish implementation (a to-do comment for future work)
   */
  render(data, r = true) {
    // Check if data is empty or an empty array
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    // Generate HTML markup using the _generateMarkup method
    const markup = this._generateMarkup();

    // If 'r' is false, return the markup string instead of rendering it to the DOM
    if (!r) return markup;

    // Clear the parent element and insert the generated markup at the beginning
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    // Update the data in the instance
    this._data = data;
    // Generate new HTML markup
    const newMarkup = this._generateMarkup();

    // Create a virtual DOM
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curELements = Array.from(this._parentElement.querySelectorAll('*'));

    // Iterate through the elements in the new and current DOM
    newElements.forEach((newEl, i) => {
      const currEl = curELements[i];

      // Update text content if they are not equal and have non-empty text nodes
      if (
        !newEl.isEqualNode(currEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        currEl.textContent = newEl.textContent;
      }

      // Update element attributes if they are not equal
      if (!newEl.isEqualNode(currEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          currEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    // Clear the content of the parent element
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    // Generate HTML markup for a spinner
    const spinnerMarkup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    // Clear the parent element and insert the spinner markup
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', spinnerMarkup);
  }

  renderError(message = this._errorMessage) {
    // Generate HTML markup for an error message
    const errorMarkup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;

    // Clear the parent element and insert the error markup
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', errorMarkup);
  }

  renderMessage(message = this._successMessage) {
    // Generate HTML markup for a success message
    const successMarkup = `
      <div class="message">
        <div>
          <svg>
            <use href="s${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;

    // Clear the parent element and insert the success markup
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', successMarkup);
  }
}
