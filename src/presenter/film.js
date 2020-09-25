import PopupView from "../view/popup.js";
import FilmCardView from "../view/card.js";
import {render, remove, RenderPosition} from "../utils/render.js";

export default class Popup {
  constructor(changeData) {
    this._changeData = changeData;
    this._popupOpen = false;

    this._onClickCreatePopup = this._onClickCreatePopup.bind(this);
    this._removePopup = this._removePopup.bind(this);
  }

  init(film) {
    this._film = film;

    this._body = document.querySelector(`body`);
    this._footer = document.querySelector(`.footer`);

    this._filmCardComponent = new FilmCardView(this._film);
    this._popupComponent = new PopupView(this._film);

    this._filmCardComponent.setCreatePopupHandler(this._onClickCreatePopup);

    return this._filmCardComponent.getElement();
  }

  destroy() {
    // this._filmCardComponent.removeAddToListHandler(this._addToList);
    remove(this._filmCardComponent);
  }

  _onClickCreatePopup(evt) {
    const targetClass = evt.target.classList;

    if (targetClass.contains(`film-card__poster`) || targetClass.contains(`film-card__title`) || targetClass.contains(`film-card__comments`)) {
      this._popupComponent = new PopupView(this._film);

      render(this._footer, this._popupComponent, RenderPosition.BEFOREEND);
      this._body.classList.toggle(`hide-overflow`);

      this._popupComponent.setMouseDownHandler(this._removePopup);
      document.addEventListener(`keydown`, this._removePopup);
    }
  }

  _removePopup(evt) {
    const buttonPressed = evt.button;
    const clickMouse = 0;

    if (evt.key === `Escape` || evt.key === `Esc` || buttonPressed === clickMouse) {
      evt.preventDefault();

      this._footer.removeChild(this._popupComponent.getElement());
      this._body.classList.toggle(`hide-overflow`);

      this._popupComponent.removeMouseDownHandler(this._removePopup);
      document.removeEventListener(`keydown`, this._removePopup);
    }
  }
}
