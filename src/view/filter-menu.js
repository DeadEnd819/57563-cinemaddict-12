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
    const target = evt.target;

    if (!target.classList.contains(`main-navigation__item--active`) && target.classList.contains(`main-navigation__item`)) {
      const activeButton = this.getElement().querySelector(`.main-navigation__item--active`);

      activeButton.classList.remove(`main-navigation__item--active`);
      target.classList.add(`main-navigation__item--active`);

      const type = target.dataset.type;
      this._callback.click(type);
    }
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }

  removeClickHandler() {
    this.getElement().removeEventListener(`click`, this._clickHandler);
    this._callback = {};
  }

  update(data, type) {
    const element = this.getElement().querySelector(`[data-type="${type}"]`).querySelector(`.main-navigation__item-count`);
    element.textContent = filter(data.slice(), type).length;
  }
}
