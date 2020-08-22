import {createElement} from "../utils.js";

const DESCRIPTION_TEXT_LENGTH = 140;

const createFilmCardTemplate = (film) => {
  const {poster, title, rating, year, duration, genres, description, comments, id} = film;
  const filmYear = year.toLocaleString(`en-US`, {year: `numeric`});
  const filmDuration = duration.getHours() + `h` + ` ` + duration.getMinutes() + `m`;
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
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
        </form>
     </article>`
  );
};

export default class FilmCard {
  constructor(film) {
    this._film = film;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
