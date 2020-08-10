export const createFilmCardTemplate = (film) => {
  const DESCRIPTION_COUNT = 140;
  const {poster, title, rating, year, duration, genre, description, comments} = film;

  return (
    `<article class="film-card">
       <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${year.toLocaleString(`en-US`, {year: `numeric`})}</span>
          <span class="film-card__duration">${duration.getHours() + `h` + ` ` + duration.getMinutes() + `m`}</span>
          <span class="film-card__genre">${genre}</span>
        </p>
        <img src="${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${description.length < DESCRIPTION_COUNT ? description : description.slice(0, DESCRIPTION_COUNT) + `...`}</p>
        <a class="film-card__comments">${comments} comments</a>
        <form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
        </form>
     </article>`
  );
};
