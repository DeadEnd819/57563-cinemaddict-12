import {createUserRankTemplate} from "./view/user-rank.js";
import {createFilterMenuTemplate} from "./view/filter-menu.js";
import {createSortMenuTemplate} from "./view/sort-menu.js";
import {createSectionFilmsTemplate} from "./view/films.js";
import {createFilmCardTemplate} from "./view/card.js";
import {createButtonTemplate} from "./view/button.js";
import {createFooterStatisticsTemplate} from "./view/statistics.js";
import {createNoDataTemplate} from "./view/no-data.js";
import {createPopupTemplate} from "./view/popup.js";
import {generateFilm} from "./mock/card.js";
import {filterByWatch, filterByHistory, filterByFavorites} from "./filter.js";
import {sortElements, getRandomInteger} from "./utils.js";

const FILM_CARD_COUNT = 5;
const FILM_COUNT = 20;

export const dataFilms = new Array(FILM_COUNT).fill().map(generateFilm);

for (let i = 0; i < dataFilms.length; i++) {
  dataFilms[i].id = `film_` + i;
  dataFilms[i].watchlist = Boolean(getRandomInteger(0, 1));
  dataFilms[i].history = Boolean(getRandomInteger(0, 1));
  dataFilms[i].favorites = Boolean(getRandomInteger(0, 1));
}

export let listFilms = dataFilms;
let watchList = filterByWatch();
let historyList = filterByHistory();
let favoritesList = filterByFavorites();

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, createUserRankTemplate(), `beforeend`);

const siteMainElement = document.querySelector(`.main`);

render(siteMainElement, createFilterMenuTemplate(), `afterbegin`);
render(siteMainElement, createSortMenuTemplate(), `beforeend`);

const siteFooterStatisticsElement = document.querySelector(`.footer__statistics`);

render(siteFooterStatisticsElement, createFooterStatisticsTemplate(), `beforeend`);

const createCardFilmsExtra = () => {
  const filmsTopRated = sortElements(dataFilms.slice(), `rating`).slice(0, 2);
  const filmsMostCommented = sortElements(dataFilms.slice(), `comments`).slice(0, 2);
  const siteFilmExtraCardElements = siteMainElement.querySelectorAll(`.films-list--extra`);
  const siteFilmTopRatedElement = siteFilmExtraCardElements[0].lastElementChild;

  for (const film of filmsTopRated) {
    render(siteFilmTopRatedElement, createFilmCardTemplate(film), `beforeend`);
  }

  const siteFilmMostCommentedElement = siteFilmExtraCardElements[1].lastElementChild;

  for (const film of filmsMostCommented) {
    render(siteFilmMostCommentedElement, createFilmCardTemplate(film), `beforeend`);
  }
};

const createCardFilms = () => {
  const siteFilmCardElement = siteMainElement.querySelector(`.films-list`).querySelector(`.films-list__container`);
  for (let i = 0; i < FILM_CARD_COUNT; i++) {
    render(siteFilmCardElement, createFilmCardTemplate(listFilms[i]), `beforeend`);
  }

  if (listFilms.length > FILM_CARD_COUNT) {
    let renderedFilmsCount = FILM_CARD_COUNT;

    const siteFilmListElement = siteMainElement.querySelector(`.films-list`);

    render(siteFilmListElement, createButtonTemplate(), `beforeend`);

    const loadMoreButton = siteFilmListElement.querySelector(`.films-list__show-more`);

    loadMoreButton.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      listFilms
        .slice(renderedFilmsCount, renderedFilmsCount + FILM_CARD_COUNT)
        .forEach((film) => render(siteFilmCardElement, createFilmCardTemplate(film), `beforeend`));

      renderedFilmsCount += FILM_CARD_COUNT;

      if (renderedFilmsCount >= listFilms.length) {
        loadMoreButton.remove();
      }
    });
  }
};

const removeCardFilms = () => {
  const cards = siteMainElement.querySelector(`.films-list`)
    .querySelector(`.films-list__container`)
    .querySelectorAll(`.film-card`);

  for (const card of cards) {
    card.remove();
  }

  const loadMoreButton = siteMainElement.querySelector(`.films-list__show-more`);

  if (loadMoreButton) {
    loadMoreButton.remove();
  }
};

if (listFilms) {
  render(siteMainElement, createSectionFilmsTemplate(), `beforeend`);
  createCardFilmsExtra();
  createCardFilms();
} else {
  render(siteMainElement, createNoDataTemplate(), `beforeend`);
}

const siteFooterElement = document.querySelector(`.footer`);
const siteBodyElement = document.querySelector(`body`);
const siteFilmsElement = document.querySelector(`.films`);

const onClickCreatePopup = (evt) => {
  if (evt.target.classList.contains(`film-card__poster`)) {
    const id = evt.target.closest(`.film-card`).dataset.id;
    const film = listFilms.slice().filter((element) => element.id === id);

    render(siteFooterElement, createPopupTemplate(film), `afterend`);
    siteBodyElement.classList.toggle(`hide-overflow`);

    const sitePopupCloseButtonElement = document.querySelector(`.film-details__close-btn`);

    siteFilmsElement.removeEventListener(`click`, onClickCreatePopup);
    sitePopupCloseButtonElement.addEventListener(`click`, onClickRemovePopup);
  }
};

const onClickRemovePopup = () => {
  const sitePopupElement = document.querySelector(`.film-details`);
  const sitePopupCloseButtonElement = sitePopupElement.querySelector(`.film-details__close-btn`);

  sitePopupElement.remove();
  siteBodyElement.classList.toggle(`hide-overflow`);

  sitePopupCloseButtonElement.removeEventListener(`click`, onClickRemovePopup);
  siteFilmsElement.addEventListener(`click`, onClickCreatePopup);
};

siteFilmsElement.addEventListener(`click`, onClickCreatePopup);

const sortsFilms = (target, element) => {
  if (!target.classList.contains(`sort__button--active`)) {
    const activeSorting = siteMainElement.querySelector(`.sort`).querySelector(`.sort__button--active`);

    activeSorting.classList.remove(`sort__button--active`);
    target.classList.add(`sort__button--active`);

    removeCardFilms();

    listFilms = element ? sortElements(listFilms.slice(), element) : dataFilms;

    createCardFilms();
  }
};

const sortClickHandler = (evt) => {
  evt.preventDefault();

  const target = evt.target;

  switch (target.textContent) {
    case `Sort by default`:
      sortsFilms(target);
      break;
    case `Sort by date`:
      sortsFilms(target, `year`);
      break;
    case `Sort by rating`:
      sortsFilms(target, `rating`);
      break;
  }
};

const siteSortElement = siteMainElement.querySelector(`.sort`);

siteSortElement.addEventListener(`click`, sortClickHandler);

const filtersFilms = (target) => {
  if (!target.classList.contains(`main-navigation__item--active`)) {
    const activeFilter = siteMainElement.querySelector(`.main-navigation`).querySelector(`.main-navigation__item--active`);

    activeFilter.classList.remove(`main-navigation__item--active`);
    target.classList.add(`main-navigation__item--active`);

    const sortButtons = siteMainElement.querySelector(`.sort`).querySelectorAll(`a`);

    for (const button of sortButtons) {
      if (button.textContent === `Sort by default`) {
        button.classList.add(`sort__button--active`);
      } else {
        button.classList.remove(`sort__button--active`);
      }
    }

    removeCardFilms();
    createCardFilms();
  }
};

const filterClickHandler = (evt) => {
  evt.preventDefault();

  const target = evt.target;

  const href = target.getAttribute(`href`);

  switch (href) {
    case `#all`:
      listFilms = dataFilms;
      filtersFilms(target);
      break;
    case `#watchlist`:
      listFilms = watchList;
      filtersFilms(target);
      break;
    case `#history`:
      listFilms = historyList;
      filtersFilms(target);
      break;
    case `#favorites`:
      listFilms = favoritesList;
      filtersFilms(target);
      break;
  }
};

const siteNavigation = siteMainElement.querySelector(`.main-navigation__items`);

siteNavigation.addEventListener(`click`, filterClickHandler);
