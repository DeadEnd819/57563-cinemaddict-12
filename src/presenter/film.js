import PopupView from "../view/popup.js";
import FilmCardView from "../view/card.js";
import {FilterType} from "../utils/const.js";
import {render, remove, RenderPosition} from "../utils/render.js";

export default class Popup {
  constructor(changeData, resetPopup) {
    this._changeData = changeData;
    this._resetPopup = resetPopup;

    this._createPopupHandler = this._createPopupHandler.bind(this);
    this.removePopup = this.removePopup.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
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

  _createPopupHandler() {
    this._resetPopup();

    this._popupComponent = new PopupView(this._film);
    render(this._footer, this._popupComponent, RenderPosition.BEFOREEND);
    this._body.classList.add(`hide-overflow`);
    this._setPopupHandlers();
  }

  removePopup() {
    this._removePopupHandlers();
    remove(this._popupComponent);
    this._body.classList.remove(`hide-overflow`);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this.removePopup();
    }
  }

  _setCardHandlers() {
    this._filmCardComponent.setCreatePopupHandler(this._createPopupHandler);
    this._filmCardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmCardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
  }

  _setPopupHandlers() {
    this._popupComponent.setMouseDownHandler(this.removePopup);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
  }

  _removePopupHandlers() {
    this._popupComponent.removeMouseDownHandler(this.removePopup);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._popupComponent.removeWatchlistClickHandler(this._handleWatchlistClick);
    this._popupComponent.removeWatchedClickHandler(this._handleWatchedClick);
    this._popupComponent.removeFavoriteClickHandler(this._handleFavoriteClick);
  }
}
