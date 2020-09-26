import PopupView from "../view/popup.js";
import FilmCardView from "../view/card.js";
import {FilterType} from "../utils/const.js";
import {render, remove, RenderPosition} from "../utils/render.js";

export default class Popup {
  constructor(changeData) {
    this._changeData = changeData;

    this._onClickCreatePopup = this._onClickCreatePopup.bind(this);
    this._removePopup = this._removePopup.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(film) {
    this._film = film;

    this._body = document.querySelector(`body`);
    this._footer = document.querySelector(`.footer`);

    this._filmCardComponent = new FilmCardView(this._film);
    this._popupComponent = new PopupView(this._film);

    this._setCardHandlers();

    return this._filmCardComponent.getElement();
  }

  update(data) {
    this._film = data;
  }

  destroy() {
    remove(this._filmCardComponent);
  }

  _handleWatchlistClick() {
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              watchlist: !this._film.watchlist
            }
        ), FilterType.WATCHLIST
    );
  }

  _handleWatchedClick() {
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              history: !this._film.history
            }
        ), FilterType.HISTORY
    );
  }

  _handleFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._film,
            {
              favorites: !this._film.favorites
            }
        ), FilterType.FAVORITES
    );
  }

  _onClickCreatePopup(evt) {
    const targetClass = evt.target.classList;

    if (targetClass.contains(`film-card__poster`) || targetClass.contains(`film-card__title`) || targetClass.contains(`film-card__comments`)) {
      this._popupComponent = new PopupView(this._film);

      render(this._footer, this._popupComponent, RenderPosition.BEFOREEND);
      this._body.classList.toggle(`hide-overflow`);
      this._popupOpen = true;
      this._setPopupHandlers();
    }
  }

  _removePopup(evt) {
    const buttonPressed = evt.button;
    const clickMouse = 0;

    if (evt.key === `Escape` || evt.key === `Esc` || buttonPressed === clickMouse) {
      evt.preventDefault();
      remove(this._popupComponent);
      this._body.classList.toggle(`hide-overflow`);

      this._popupComponent.removeMouseDownHandler(this._removePopup);
      document.removeEventListener(`keydown`, this._removePopup);
    }
  }

  _setCardHandlers() {
    this._filmCardComponent.setCreatePopupHandler(this._onClickCreatePopup);
    this._filmCardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmCardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
  }

  _setPopupHandlers() {
    this._popupComponent.setMouseDownHandler(this._removePopup);
    document.addEventListener(`keydown`, this._removePopup);
    this._popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
  }
}
