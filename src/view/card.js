import AbstractView from "./abstract.js";

const DESCRIPTION_TEXT_LENGTH = 140;

const createFilmCardTemplate = (film) => {
  const {poster, title, rating, year, duration, genres, description, comments, watchlist, history, favorites, id} = film;
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
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlist ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${history ? `film-card__controls-item--active` : ``}">Mark as watched</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite ${favorites ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
        </form>
     </article>`
  );
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click(evt);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.film-card__controls`).addEventListener(`click`, this._clickHandler);
  }

  removeClickHandler() {
    this.getElement().querySelector(`.film-card__controls`).removeEventListener(`click`, this._clickHandler);
    this._callback = {};
  }
}
