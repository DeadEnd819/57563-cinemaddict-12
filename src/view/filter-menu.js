import {filterByWatch, filterByHistory, filterByFavorites} from "../filter.js";
import {createElement} from "../utils.js";

const createFilterMenuTemplate = () => {
  return (
    `<nav class="main-navigation">
       <div class="main-navigation__items">
         <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
         <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${filterByWatch().length}</span></a>
         <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${filterByHistory().length}</span></a>
         <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${filterByFavorites().length}</span></a>
       </div>
       <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class FilterMenu {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilterMenuTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
