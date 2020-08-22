import {render, RenderPosition} from "./utils.js";
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

render(siteHeaderElement, new UserRankView().getElement(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.main`);

const filterMenuComponent = new FilterMenuView();

render(siteMainElement, filterMenuComponent.getElement(), RenderPosition.AFTERBEGIN);

const sortMenuComponent = new SortMenuView();

render(siteMainElement, sortMenuComponent.getElement(), RenderPosition.BEFOREEND);

const siteFooterStatisticsElement = document.querySelector(`.footer__statistics`);

render(siteFooterStatisticsElement, new FooterStatisticsView().getElement(), RenderPosition.BEFOREEND);

const createCardFilmsExtra = () => {
  const filmsTopRated = sortElements(dataFilms.slice(), `rating`).slice(0, 2);
  const filmsMostCommented = sortElements(dataFilms.slice(), `comments`).slice(0, 2);
  const siteFilmExtraCardElements = sectionFilmsComponent.getElement().querySelectorAll(`.films-list--extra`);
  const siteFilmTopRatedElement = siteFilmExtraCardElements[0].lastElementChild;

  for (const film of filmsTopRated) {
    render(siteFilmTopRatedElement, new FilmCardView(film).getElement(), RenderPosition.BEFOREEND);
  }

  const siteFilmMostCommentedElement = siteFilmExtraCardElements[1].lastElementChild;

  for (const film of filmsMostCommented) {
    render(siteFilmMostCommentedElement, new FilmCardView(film).getElement(), RenderPosition.BEFOREEND);
  }
};

const createCardFilms = () => {
  const siteFilmListElement = sectionFilmsComponent.getElement().querySelector(`.films-list`);
  const siteFilmCardElement = siteFilmListElement.querySelector(`.films-list__container`);

  for (let i = 0; i < FILM_CARD_COUNT; i++) {
    render(siteFilmCardElement, new FilmCardView(listFilms[i]).getElement(), RenderPosition.BEFOREEND);
  }

  if (listFilms.length > FILM_CARD_COUNT) {
    let renderedFilmsCount = FILM_CARD_COUNT;

    const loadMoreButtonComponent = new ButtonView();

    render(siteFilmListElement, loadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

    loadMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      listFilms
        .slice(renderedFilmsCount, renderedFilmsCount + FILM_CARD_COUNT)
        .forEach((film) => render(siteFilmCardElement, new FilmCardView(film).getElement(), RenderPosition.BEFOREEND));

      renderedFilmsCount += FILM_CARD_COUNT;

      if (renderedFilmsCount >= listFilms.length) {
        loadMoreButtonComponent.getElement().remove();
        loadMoreButtonComponent.removeElement();
      }
    });
  }
};

const removeCardFilms = () => {
  const cards = sectionFilmsComponent.getElement().querySelector(`.films-list`)
    .querySelector(`.films-list__container`)
    .querySelectorAll(`.film-card`);

  for (const card of cards) {
    card.remove();
  }

  const loadMoreButton = sectionFilmsComponent.getElement().querySelector(`.films-list__show-more`);

  if (loadMoreButton) {
    loadMoreButton.remove();
  }
};

if (listFilms.length) {
  render(siteMainElement, sectionFilmsComponent.getElement(), RenderPosition.BEFOREEND);
  createCardFilmsExtra();
  createCardFilms();
} else {
  render(siteMainElement, new NoDataView().getElement(), RenderPosition.BEFOREEND);
}

const siteFooterElement = document.querySelector(`.footer`);
const siteBodyElement = document.querySelector(`body`);
let popupComponent = null;

const onClickCreatePopup = (evt) => {
  const targetClass = evt.target.classList;
  if (targetClass.contains(`film-card__poster`) || targetClass.contains(`film-card__title`) || targetClass.contains(`film-card__comments`)) {
    evt.preventDefault();

    const id = evt.target.closest(`.film-card`).dataset.id;
    const film = dataFilms.slice().filter((element) => element.id === id);

    popupComponent = new PopupView(film);

    siteFooterElement.appendChild(popupComponent.getElement());
    siteBodyElement.classList.toggle(`hide-overflow`);

    const sitePopupCloseButtonElement = popupComponent.getElement().querySelector(`.film-details__close-btn`);

    sectionFilmsComponent.getElement().removeEventListener(`click`, onClickCreatePopup);
    sitePopupCloseButtonElement.addEventListener(`mousedown`, onClickRemovePopup);
    document.addEventListener(`keydown`, onClickRemovePopup);
  }
};

const onClickRemovePopup = (evt) => {
  const buttonPressed = evt.button;
  const clickMouse = 0;

  if (evt.key === `Escape` || evt.key === `Esc` || buttonPressed === clickMouse) {
    evt.preventDefault();

    const sitePopupCloseButtonElement = popupComponent.getElement().querySelector(`.film-details__close-btn`);

    siteFooterElement.removeChild(popupComponent.getElement());
    siteBodyElement.classList.toggle(`hide-overflow`);

    sitePopupCloseButtonElement.removeEventListener(`mousedown`, onClickRemovePopup);
    document.removeEventListener(`keydown`, onClickRemovePopup);
    sectionFilmsComponent.getElement().addEventListener(`click`, onClickCreatePopup);
  }
};

sectionFilmsComponent.getElement().addEventListener(`click`, onClickCreatePopup);

const sortsFilms = (target, element) => {
  if (!target.classList.contains(`sort__button--active`)) {
    const activeSorting = sortMenuComponent.getElement().querySelector(`.sort__button--active`);

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

sortMenuComponent.getElement().addEventListener(`click`, sortClickHandler);

const filtersFilms = (target, list) => {
  if (!target.classList.contains(`main-navigation__item--active`)) {
    listFilms = list;
    const activeFilter = filterMenuComponent.getElement().querySelector(`.main-navigation__item--active`);

    activeFilter.classList.remove(`main-navigation__item--active`);
    target.classList.add(`main-navigation__item--active`);

    const sortButtons = sortMenuComponent.getElement().querySelectorAll(`a`);

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

filterMenuComponent.getElement().addEventListener(`click`, filterClickHandler);
