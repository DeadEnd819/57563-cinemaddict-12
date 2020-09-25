import {STATISTICS_BUTTON} from "../utils/const.js";
import AbstractView from "./abstract.js";

const createStatisticsButtonTemplate = () => {
  return (
    `<a href="#stats" class="main-navigation__additional" data-type="${STATISTICS_BUTTON}">Stats</a>`
  );
};

export default class StatisticsButton extends AbstractView {
  constructor() {
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createStatisticsButtonTemplate();
  }

  _clickHandler(evt) {
    evt.preventDefault();

    if (!evt.target.classList.contains(`main-navigation__item--active`)) {
      evt.target.classList.add(`main-navigation__item--active`);
      this._callback.click(evt);
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
}
