import {filterByWatch, filterByHistory, filterByFavorites} from "../utils/filter.js";
import AbstractView from "./abstract.js";

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

export default class FilterMenu extends AbstractView {
  constructor() {
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }
  getTemplate() {
    return createFilterMenuTemplate();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click(evt);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }

  removeClickHandler() {
    this.getElement().removeEventListener(`click`, this._clickHandler);
    this._callback = {};
  }
}
