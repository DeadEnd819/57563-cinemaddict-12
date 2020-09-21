import PopupView from "../view/popup.js";
import {render, replace, remove, RenderPosition} from "../utils/render.js";

export default class Popup {
  constructor(container, footer, body) {
    this._container = container;
    this._footer = footer;
    this._body = body;

    this._removePopup = this._removePopup.bind(this);
  }

  init(target, data) {
    this._target = target;
    this._sourcedlistFilms = data;

    this._id = null;
    this._film = null;
    this._popupComponent = null;

    this._createPopup();
  }

  _createPopup() {
    const targetClass = this._target.classList;

    if (targetClass.contains(`film-card__poster`) || targetClass.contains(`film-card__title`) || targetClass.contains(`film-card__comments`)) {
      this._id = this._target.closest(`.film-card`).dataset.id;
      this._film = this._sourcedlistFilms.slice().filter((element) => element.id === this._id);

      this._popupComponent = new PopupView(this._film);

      // this._footer.appendChild(this._popupComponent.getElement());
      render(this._footer, this._popupComponent, RenderPosition.AFTERBEGIN);
      this._body.classList.toggle(`hide-overflow`);

      // this._container.removeClickHandler();
      this._popupComponent.setMouseDownHandler(this._removePopup);
      document.addEventListener(`keydown`, this._removePopup);
    }
  }

  _removePopup(evt) {
    const buttonPressed = evt.button;
    const clickMouse = 0;

    if (evt.key === `Escape` || evt.key === `Esc` || buttonPressed === clickMouse) {
      evt.preventDefault();

      this._id = null;

      this._footer.removeChild(this._popupComponent.getElement());
      this._body.classList.toggle(`hide-overflow`);

      this._popupComponent.removeMouseDownHandler();
      document.removeEventListener(`keydown`, this._removePopup);
      // this._container.setClickHandler(this._createPopup);
    }
  }
}
