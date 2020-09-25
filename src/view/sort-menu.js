import AbstractView from "./abstract.js";
import {Containers, SortType} from "../utils/const.js";

const createSortMenuTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#" class="sort__button sort__button--active" data-type="${SortType.DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button" data-type="${SortType.YEAR}">Sort by date</a></li>
      <li><a href="#" class="sort__button" data-type="${SortType.RATING}">Sort by rating</a></li>
    </ul>`
  );
};

export default class SortMenu extends AbstractView {
  constructor() {
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createSortMenuTemplate();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    const target = evt.target;
    const type = target.dataset.type;

    if (!target.classList.contains(`sort__button--active`) && target.classList.contains(`sort__button`)) {
      const activeButton = this.getElement().querySelector(`.sort__button--active`);

      activeButton.classList.remove(`sort__button--active`);
      target.classList.add(`sort__button--active`);

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

  resetActiveButton() {
    const activeButton = this.getElement().querySelector(`.sort__button--active`);
    const defaultButton = this.getElement().querySelector(`[data-type="${SortType.DEFAULT}"]`);

    if (activeButton !== defaultButton) {
      activeButton.classList.remove(`sort__button--active`);
      defaultButton.classList.add(`sort__button--active`);
    }
  }
}
