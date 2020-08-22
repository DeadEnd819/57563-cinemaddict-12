import {renderElement, RenderPosition} from "./utils.js";
import {sortElements} from "./utils.js";
import {filterByWatch, filterByHistory, filterByFavorites} from "./filter.js";
import UserRankView from "./view/user-rank.js";
import FilterMenuView from "./view/filter-menu.js";
import SortMenuView from "./view/sort-menu.js";
import SectionFilmsView from "./view/films.js";
import FilmCardView from "./view/card.js";
import ButtonView from "./view/button.js";
import FooterStatisticsView from "./view/statistics.js";
import NoDataView from "./view/no-data.js";
import PopupView from "./view/popup.js";
import {generateFilm} from "./mock/card.js";

const FILM_CARD_COUNT = 5;
const FILM_COUNT = 20;

export const dataFilms = new Array(FILM_COUNT).fill().map(generateFilm);

export let listFilms = dataFilms;
let watchList = filterByWatch();
let historyList = filterByHistory();
let favoritesList = filterByFavorites();

const sectionFilmsComponent = new SectionFilmsView();

const siteHeaderElement = document.querySelector(`.header`);

renderElement(siteHeaderElement, new UserRankView().getElement(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.main`);

renderElement(siteMainElement, new FilterMenuView().getElement(), RenderPosition.AFTERBEGIN);
renderElement(siteMainElement, new SortMenuView().getElement(), RenderPosition.BEFOREEND);

const siteFooterStatisticsElement = document.querySelector(`.footer__statistics`);

renderElement(siteFooterStatisticsElement, new FooterStatisticsView().getElement(), RenderPosition.BEFOREEND);

const createCardFilmsExtra = () => {
  const filmsTopRated = sortElements(dataFilms.slice(), `rating`).slice(0, 2);
  const filmsMostCommented = sortElements(dataFilms.slice(), `comments`).slice(0, 2);
  const siteFilmExtraCardElements = siteMainElement.querySelectorAll(`.films-list--extra`);
  const siteFilmTopRatedElement = siteFilmExtraCardElements[0].lastElementChild;

  for (const film of filmsTopRated) {
    renderElement(siteFilmTopRatedElement, new FilmCardView(film).getElement(), RenderPosition.BEFOREEND);
  }

  const siteFilmMostCommentedElement = siteFilmExtraCardElements[1].lastElementChild;

  for (const film of filmsMostCommented) {
    renderElement(siteFilmMostCommentedElement, new FilmCardView(film).getElement(), RenderPosition.BEFOREEND);
  }
};

const createCardFilms = () => {
  const siteFilmCardElement = siteMainElement.querySelector(`.films-list`).querySelector(`.films-list__container`);
  for (let i = 0; i < FILM_CARD_COUNT; i++) {
    renderElement(siteFilmCardElement, new FilmCardView(listFilms[i]).getElement(), RenderPosition.BEFOREEND);
  }

  if (listFilms.length > FILM_CARD_COUNT) {
    let renderedFilmsCount = FILM_CARD_COUNT;

    const siteFilmListElement = siteMainElement.querySelector(`.films-list`);

    renderElement(siteFilmListElement, new ButtonView().getElement(), RenderPosition.BEFOREEND);

    const loadMoreButton = siteFilmListElement.querySelector(`.films-list__show-more`);

    loadMoreButton.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      listFilms
        .slice(renderedFilmsCount, renderedFilmsCount + FILM_CARD_COUNT)
        .forEach((film) => renderElement(siteFilmCardElement, new FilmCardView(film).getElement(), RenderPosition.BEFOREEND));

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

if (listFilms.length) {
  renderElement(siteMainElement, sectionFilmsComponent.getElement(), RenderPosition.BEFOREEND);
  createCardFilmsExtra();
  createCardFilms();
} else {
  renderElement(siteMainElement, new NoDataView().getElement(), RenderPosition.BEFOREEND);
}

const siteFooterElement = document.querySelector(`.footer`);
const siteBodyElement = document.querySelector(`body`);
const siteFilmsElement = document.querySelector(`.films`);

const onClickCreatePopup = (evt) => {
  if (evt.target.classList.contains(`film-card__poster`)) {
    const id = evt.target.closest(`.film-card`).dataset.id;
    const film = dataFilms.slice().filter((element) => element.id === id);

    renderElement(siteFooterElement, new PopupView(film).getElement(), RenderPosition.AFTERBEGIN);
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

    if (listFilms.length) {
      removeCardFilms();

      listFilms = element ? sortElements(listFilms.slice(), element) : dataFilms;

      createCardFilms();
    }
  }
};

const sortClickHandler = (evt) => {
  evt.preventDefault();

  const target = evt.target;

  switch (target.textContent) {
    case `Sort by default`:
      return sortsFilms(target);
    case `Sort by date`:
      return sortsFilms(target, `year`);
    case `Sort by rating`:
      return sortsFilms(target, `rating`);
    default:
      return null;
  }
};

const siteSortElement = siteMainElement.querySelector(`.sort`);

siteSortElement.addEventListener(`click`, sortClickHandler);

const filtersFilms = (target, list) => {
  if (!target.classList.contains(`main-navigation__item--active`)) {
    listFilms = list;
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

    if (listFilms.length) {
      removeCardFilms();
      createCardFilms();
    }
  }
};

const filterClickHandler = (evt) => {
  evt.preventDefault();

  const target = evt.target;

  const href = target.getAttribute(`href`);

  switch (href) {
    case `#all`:
      return filtersFilms(target, dataFilms);
    case `#watchlist`:
      return filtersFilms(target, watchList);
    case `#history`:
      return filtersFilms(target, historyList);
    case `#favorites`:
      return filtersFilms(target, favoritesList);
    default:
      return null;
  }
};

const siteNavigation = siteMainElement.querySelector(`.main-navigation__items`);

siteNavigation.addEventListener(`click`, filterClickHandler);
