import AbstractView from "./abstract.js";
import {humanizeReleaseDate} from "../utils/common.js";
import moment from "moment";

const DESCRIPTION_TEXT_LENGTH = 140;

const createFilmCardTemplate = (film) => {
  const {poster, title, rating, year, duration, genres, description, comments, watchlist, history, favorites, id} = film;
  const filmYear = moment(year).format(`Y`);
  const filmDuration = humanizeReleaseDate(duration);
  const filmGenres = genres.slice(0, 1);
  const filmDescription = description.length < DESCRIPTION_TEXT_LENGTH ? description : description.slice(0, DESCRIPTION_TEXT_LENGTH) + `...`;

  return (
    `<article class="film-card" data-id="${id}">
       <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${filmYear}</span>
          <span class="film-card__duration">${filmDuration}</span>
          <span class="film-card__genre">${filmGenres}</span>
        </p>
        <img src="${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${filmDescription}</p>
        <a class="film-card__comments">${comments.length} comments</a>
        <form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlist ? `film-card__controls-item--active` : ``}" data-list="watchlist">Add to watchlist</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${history ? `film-card__controls-item--active` : ``}" data-list="history">Mark as watched</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite ${favorites ? `film-card__controls-item--active` : ``}" data-list="favorites">Mark as favorite</button>
        </form>
     </article>`
  );
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._createPopupHandler = this._createPopupHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _createPopupHandler(evt) {
    evt.preventDefault();
    const targetClass = evt.target.classList;
    if (targetClass.contains(`film-card__poster`) || targetClass.contains(`film-card__title`) || targetClass.contains(`film-card__comments`)) {
      this._callback.createPopup(evt);
    }
  }

  setCreatePopupHandler(callback) {
    this._callback.createPopup = callback;
    this.getElement().addEventListener(`click`, this._createPopupHandler);
  }

  removeCreatePopupHandler() {
    this.getElement().removeEventListener(`click`, this._createPopupHandler);
    this._callback.createPopup = null;
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    evt.target.classList.toggle(`film-card__controls-item--active`);
    this._callback.watchlistClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    evt.target.classList.toggle(`film-card__controls-item--active`);
    this._callback.watchedClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    evt.target.classList.toggle(`film-card__controls-item--active`);
    this._callback.favoriteClick();
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }
}
