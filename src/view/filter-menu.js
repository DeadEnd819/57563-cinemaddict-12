import {filter} from "../utils/filter.js";
import {FilterType} from "../utils/const.js";
import AbstractView from "./abstract.js";

const createFilterMenuTemplate = (films) => {
  return (
    `<nav class="main-navigation">
       <div class="main-navigation__items">
         <a href="#all" class="main-navigation__item main-navigation__item--active" data-type="${FilterType.ALL}">All movies</a>
         <a href="#watchlist" class="main-navigation__item" data-type="${FilterType.WATCHLIST}">Watchlist <span class="main-navigation__item-count">${filter(films, FilterType.WATCHLIST).length}</span></a>
         <a href="#history" class="main-navigation__item" data-type="${FilterType.HISTORY}">History <span class="main-navigation__item-count">${filter(films, FilterType.HISTORY).length}</span></a>
         <a href="#favorites" class="main-navigation__item" data-type="${FilterType.FAVORITES}">Favorites <span class="main-navigation__item-count">${filter(films, FilterType.FAVORITES).length}</span></a>
       </div>
       <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class FilterMenu extends AbstractView {
  constructor(films) {
    super();

    this._films = films;
    this._activeFilter = null;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createFilterMenuTemplate(this._films);
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

  update(activeFilter) {
    this._activeFilter = activeFilter;
    const activeFilterButton = this.getElement().querySelector(`.main-navigation__item--active`);
    const filterNavigation = this.getElement().querySelectorAll(`.main-navigation__item`);

    for (const item of filterNavigation) {
      if (item.getAttribute(`href`) === activeFilter) {
        if (!item.classList.contains(`.main-navigation__item--active`)) {
          activeFilterButton.classList.remove(`main-navigation__item--active`);
          item.classList.add(`main-navigation__item--active`);
        }
        break;
      }
    }
  }
}
