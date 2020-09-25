import PopupView from "../view/popup.js";
import FilmCardView from "../view/card.js";
import {render, remove, RenderPosition} from "../utils/render.js";

export default class Popup {
  constructor(addToList) {
    this._addToList = addToList;
    this._popupOpen = false;

    // this._onClickCreatePopup = this._onClickCreatePopup.bind(this);
    // this._removePopup = this._removePopup.bind(this);
  }

  init(film) {
    this._film = film;

    this._filmCardComponent = new FilmCardView(this._film);
    this._popupComponent = new PopupView(this._film);

    // this._filmCardComponent.setCreatePopupHandler(this._onClickCreatePopup);
    // this._filmCardComponent.setAddToListHandler(this._addToList);

    return this._filmCardComponent.getElement();
  }

  destroy() {
    // this._filmCardComponent.removeAddToListHandler(this._addToList);
    remove(this._filmCardComponent);
  }
}
