import {createUserRankTemplate} from "./view/user-rank.js";
import {createMainMenuTemplate} from "./view/main-menu.js";
import {createSectionFilmsTemplate} from "./view/films.js";
import {createFilmCardTemplate} from "./view/card.js";
import {createButtonTemplate} from "./view/button.js";
import {createFooterStatisticsTemplate} from "./view/statistics.js";
import {createNoDataTemplate} from "./view/noData.js";
import {generateFilm} from "./mock/card.js";
import {sortFilms} from "./utils.js";

const FILM_CARD_COUNT = 5;
const FILM_COUNT = 20;

const films = new Array(FILM_COUNT).fill().map(generateFilm);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, createUserRankTemplate(), `beforeend`);

const siteMainElement = document.querySelector(`.main`);

render(siteMainElement, createMainMenuTemplate(), `beforeend`);

const siteFooterStatisticsElement = document.querySelector(`.footer__statistics`);

render(siteFooterStatisticsElement, createFooterStatisticsTemplate(), `beforeend`);

const createCardFilms = () => {
  const siteFilmCardElement = siteMainElement.querySelector(`.films-list`).querySelector(`.films-list__container`);
  for (let i = 0; i < FILM_CARD_COUNT; i++) {
    render(siteFilmCardElement, createFilmCardTemplate(films[i]), `beforeend`);
  }

  const filmsTopRated = sortFilms(films.slice(), `rating`).slice(0, 2);
  const filmsMostCommented = sortFilms(films.slice(), `comments`).slice(0, 2);
  const siteFilmExtraCardElements = siteMainElement.querySelectorAll(`.films-list--extra`);
  const siteFilmTopRatedElement = siteFilmExtraCardElements[0].lastElementChild;

  for (const film of filmsTopRated) {
    render(siteFilmTopRatedElement, createFilmCardTemplate(film), `beforeend`);
  }

  const siteFilmMostCommentedElement = siteFilmExtraCardElements[1].lastElementChild;

  for (const film of filmsMostCommented) {
    render(siteFilmMostCommentedElement, createFilmCardTemplate(film), `beforeend`);
  }

  if (films.length > FILM_CARD_COUNT) {
    let renderedFilmsCount = FILM_CARD_COUNT;

    const siteFilmListElement = siteMainElement.querySelector(`.films-list`);

    render(siteFilmListElement, createButtonTemplate(), `beforeend`);

    const loadMoreButton = siteFilmListElement.querySelector(`.films-list__show-more`);

    loadMoreButton.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      films
        .slice(renderedFilmsCount, renderedFilmsCount + FILM_CARD_COUNT)
        .forEach((film) => render(siteFilmCardElement, createFilmCardTemplate(film), `beforeend`));

      renderedFilmsCount += FILM_CARD_COUNT;

      if (renderedFilmsCount >= films.length) {
        loadMoreButton.remove();
      }
    });
  }
};

if (films) {
  render(siteMainElement, createSectionFilmsTemplate(), `beforeend`);
  createCardFilms();
} else {
  render(siteMainElement, createNoDataTemplate(), `beforeend`);
}

