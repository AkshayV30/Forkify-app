import View from './view';
import previewView from './previewView';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No Recipe Found. <br>  Please try another Recipe `;
  _successMessage = ``;

  _generateMarkup() {
    //  console.log(this._data);
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
