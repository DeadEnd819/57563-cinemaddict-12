import FilterMenuView from "../view/filter-menu.js";
import SortMenuView from "../view/sort-menu.js";
import SectionFilmsView from "../view/films.js";
import NoDataView from "../view/no-data";
import PopupView from "../view/popup";
import FilmCardView from "../view/card";
import ButtonView from "../view/button";
import {filterByWatch, filterByHistory, filterByFavorites} from "../utils/filter.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {sortElements} from "../utils/sort";

const FILM_CARD_COUNT = 5;

export default class MovieList {
  constructor(main, footer, body) {
    this._container = main;
    this._footer = footer;
    this._body = body;

    this._sectionFilmsComponent = new SectionFilmsView();
    this._filterMenuComponent = new FilterMenuView();
    this._sortMenuComponent = new SortMenuView();
    this._popupComponent = null;

    this._sortClickHandler = this._sortClickHandler.bind(this);
    this._filterClickHandler = this._filterClickHandler.bind(this);
    this._onClickCreatePopup = this._onClickCreatePopup.bind(this);
    this._onClickRemovePopup = this._onClickRemovePopup.bind(this);
  }

  init(films) {
    this._listFilms = films.slice();
    this._sourcedlistFilms = films.slice();

    this._watchList = filterByWatch();
    this._historyList = filterByHistory();
    this._favoritesList = filterByFavorites();

    this._renderListFilms();
  }

  _renderSectionFilms() {
    render(this._container, this._sectionFilmsComponent, RenderPosition.BEFOREEND);
  }

  _renderFilter() {
    render(this._container, this._filterMenuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    render(this._container, this._sortMenuComponent, RenderPosition.BEFOREEND);
  }

  _renderLoadMoreButton() {

  }

  _createCardFilmsExtra() {
    const filmsTopRated = sortElements(this._sourcedlistFilms.slice(), `rating`).slice(0, 2);
    const filmsMostCommented = sortElements(this._sourcedlistFilms.slice(), `comments`).slice(0, 2);
    const siteFilmExtraCardElements = this._sectionFilmsComponent.getElement().querySelectorAll(`.films-list--extra`);
    const siteFilmTopRatedElement = siteFilmExtraCardElements[0].lastElementChild;

    for (const film of filmsTopRated) {
      render(siteFilmTopRatedElement, new FilmCardView(film), RenderPosition.BEFOREEND);
    }

    const siteFilmMostCommentedElement = siteFilmExtraCardElements[1].lastElementChild;

    for (const film of filmsMostCommented) {
      render(siteFilmMostCommentedElement, new FilmCardView(film), RenderPosition.BEFOREEND);
    }
  }

  _createCardFilms() {
    const siteFilmListElement = this._sectionFilmsComponent.getElement().querySelector(`.films-list`);
    const siteFilmCardElement = siteFilmListElement.querySelector(`.films-list__container`);

    for (let i = 0; i < FILM_CARD_COUNT; i++) {
      render(siteFilmCardElement, new FilmCardView(this._listFilms[i]), RenderPosition.BEFOREEND);
    }

    if (this._listFilms.length > FILM_CARD_COUNT) {
      let renderedFilmsCount = FILM_CARD_COUNT;

      const loadMoreButtonComponent = new ButtonView();

      render(siteFilmListElement, loadMoreButtonComponent, RenderPosition.BEFOREEND);

      loadMoreButtonComponent.setClickHandler(() => {
        this._listFilms
          .slice(renderedFilmsCount, renderedFilmsCount + FILM_CARD_COUNT)
          .forEach((film) => render(siteFilmCardElement, new FilmCardView(film), RenderPosition.BEFOREEND));

        renderedFilmsCount += FILM_CARD_COUNT;

        if (renderedFilmsCount >= this._listFilms.length) {
          remove(loadMoreButtonComponent);
        }
      });
    }
  }

  _removeCardFilms() {
    const cards = this._sectionFilmsComponent.getElement().querySelector(`.films-list`)
      .querySelector(`.films-list__container`)
      .querySelectorAll(`.film-card`);

    for (const card of cards) {
      card.remove();
    }

    const loadMoreButton = this._sectionFilmsComponent.getElement().querySelector(`.films-list__show-more`);

    if (loadMoreButton) {
      loadMoreButton.remove();
    }
  }

  _sortsFilms(target, element) {
    if (!target.classList.contains(`sort__button--active`)) {
      const activeSorting = this._sortMenuComponent.getElement().querySelector(`.sort__button--active`);

      activeSorting.classList.remove(`sort__button--active`);
      target.classList.add(`sort__button--active`);

      if (this._listFilms.length) {
        this._removeCardFilms();

        this._listFilms = element ? sortElements(this._listFilms.slice(), element) : this._sourcedlistFilms;

        this._createCardFilms();
      }
    }
  }

  _sortClickHandler(evt) {
    evt.preventDefault();

    const target = evt.target;

    switch (target.textContent) {
      case `Sort by default`:
        return this._sortsFilms(target);
      case `Sort by date`:
        return this._sortsFilms(target, `year`);
      case `Sort by rating`:
        return this._sortsFilms(target, `rating`);
      default:
        return null;
    }
  }

  _filtersFilms(target, list) {
    if (!target.classList.contains(`main-navigation__item--active`)) {
      this._listFilms = list;
      const activeFilter = this._filterMenuComponent.getElement().querySelector(`.main-navigation__item--active`);

      activeFilter.classList.remove(`main-navigation__item--active`);
      target.classList.add(`main-navigation__item--active`);

      const sortButtons = this._sortMenuComponent.getElement().querySelectorAll(`a`);

      for (const button of sortButtons) {
        if (button.textContent === `Sort by default`) {
          button.classList.add(`sort__button--active`);
        } else {
          button.classList.remove(`sort__button--active`);
        }
      }

      if (this._listFilms.length) {
        this._removeCardFilms();
        this._createCardFilms();
      }
    }
  }

  _filterClickHandler(evt) {
    evt.preventDefault();

    const target = evt.target;

    const href = target.getAttribute(`href`);

    switch (href) {
      case `#all`:
        return this._filtersFilms(target, this._sourcedlistFilms);
      case `#watchlist`:
        return this._filtersFilms(target, this._watchList);
      case `#history`:
        return this._filtersFilms(target, this._historyList);
      case `#favorites`:
        return this._filtersFilms(target, this._favoritesList);
      default:
        return null;
    }
  }

  _onClickCreatePopup(evt) {
    const targetClass = evt.target.classList;
    if (targetClass.contains(`film-card__poster`) || targetClass.contains(`film-card__title`) || targetClass.contains(`film-card__comments`)) {
      const id = evt.target.closest(`.film-card`).dataset.id;
      const film = this._sourcedlistFilms.slice().filter((element) => element.id === id);

      this._popupComponent = new PopupView(film);

      this._footer.appendChild(this._popupComponent.getElement());
      this._body.classList.toggle(`hide-overflow`);

      this._sectionFilmsComponent.removeClickHandler();
      this._popupComponent.setMouseDownHandler(this._onClickRemovePopup);
      document.addEventListener(`keydown`, this._onClickRemovePopup);
    }
  }

  _onClickRemovePopup(evt) {
    const buttonPressed = evt.button;
    const clickMouse = 0;

    if (evt.key === `Escape` || evt.key === `Esc` || buttonPressed === clickMouse) {
      evt.preventDefault();

      this._footer.removeChild(this._popupComponent.getElement());
      this._body.classList.toggle(`hide-overflow`);

      this._popupComponent.removeMouseDownHandler();
      document.removeEventListener(`keydown`, this._onClickRemovePopup);
      this._sectionFilmsComponent.setClickHandler(this._onClickCreatePopup);
    }
  }

  _renderListFilms() {
    this._renderFilter();
    this._renderSort();

    if (!this._listFilms.length) {
      render(this._container, new NoDataView(), RenderPosition.BEFOREEND);
    }

    this._renderSectionFilms();
    this._createCardFilmsExtra();
    this._createCardFilms();

    this._sortMenuComponent.setClickHandler(this._sortClickHandler);
    this._filterMenuComponent.setClickHandler(this._filterClickHandler);
    this._sectionFilmsComponent.setClickHandler(this._onClickCreatePopup);
  }
}
