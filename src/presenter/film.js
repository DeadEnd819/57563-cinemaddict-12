import PopupView from "../view/popup.js";
import FilmCardView from "../view/card.js";
import {render, remove, RenderPosition} from "../utils/render.js";

export default class Popup {
  constructor(filmListContainer, footerContainer, bodyContainer, addToList) {
    this._filmListContainer = filmListContainer;
    this._footer = footerContainer;
    this._body = bodyContainer;
    this._addToList = addToList;

    this._onClickCreatePopup = this._onClickCreatePopup.bind(this);
    this._removePopup = this._removePopup.bind(this);
  }

  init(film) {
    this._film = film;
    this._cardActive = false;

    this._filmCardComponent = new FilmCardView(this._film);
    this._popupComponent = null;

    this.toggleStatusCard(this._film.id);
    this._filmCardComponent.setCreatePopupHandler(this._onClickCreatePopup);
    this._filmCardComponent.setAddToListHandler(this._addToList);
  }

  getCardComponent() {
    return this._filmCardComponent;
  }

  getPopupComponent() {
    return this._popupComponent ? this._popupComponent : null;
  }

  getStatusCard() {
    return this._cardActive;
  }

  renderFilm(container) {
    render(container, this._filmCardComponent, RenderPosition.BEFOREEND);
  }

  destroy() {
    this._filmCardComponent.removeAddToListHandler(this._addToList);
    remove(this._filmCardComponent);
  }

  toggleStatusCard(id) {
    if (!this._cardActive) {
      this.renderFilm(this._filmListContainer);
      this._cardActive = !this._cardActive;
      return;
    }

    this._deleteFilm(id);
    this._cardActive = !this._cardActive;
  }

  _deleteFilm(id) {
    const card = this._filmListContainer.querySelector(`[data-id="${id}"]`);
    card.remove();
  }

  _onClickCreatePopup(evt) {
    const targetClass = evt.target.classList;

    if (targetClass.contains(`film-card__poster`) || targetClass.contains(`film-card__title`) || targetClass.contains(`film-card__comments`)) {
      this._popupComponent = new PopupView(this._film);

      render(this._footer, this._popupComponent, RenderPosition.BEFOREEND);
      this._body.classList.toggle(`hide-overflow`);

      this._filmCardComponent.removeCreatePopupHandler(this._onClickCreatePopup);
      this._popupComponent.setMouseDownHandler(this._removePopup);
      document.addEventListener(`keydown`, this._removePopup);
      this._popupComponent.setAddToListHandler(this._addToList);
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
      this._filmCardComponent.setCreatePopupHandler(this._onClickCreatePopup);
      this._popupComponent.removeAddToListHandler(this._addToList);
    }
  }
}
