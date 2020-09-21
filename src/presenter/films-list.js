import ProfileRatingView from "../view/profile-rating.js";
import FilterMenuView from "../view/filter-menu.js";
import SortMenuView from "../view/sort-menu.js";
import SectionFilmsView from "../view/films.js";
import NoDataView from "../view/no-data";
import PopupView from "../view/popup";
import FilmCardView from "../view/card";
import StatisticsView from "../view/statistics";
import ButtonView from "../view/button";
import {filter} from "../utils/filter.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {sortElements} from "../utils/sort";

const FILM_CARD_COUNT = 5;

export default class MovieList {
  constructor(head, main, footer, body) {
    this._head = head;
    this._container = main;
    this._footer = footer;
    this._body = body;

    this._renderedFilmsCount = FILM_CARD_COUNT;

    this._sectionFilmsComponent = new SectionFilmsView();
    this._sortMenuComponent = new SortMenuView();
    this._profileRatingComponent = null;
    this._filterMenuComponent = null;
    this._statisticsComponent = null;
    this._popupComponent = null;
    this._noDataComponent = null;
    this._loadMoreButtonComponent = null;

    this._sortClickHandler = this._sortClickHandler.bind(this);
    this._filterClickHandler = this._filterClickHandler.bind(this);
    this._onClickCreatePopup = this._onClickCreatePopup.bind(this);
    this._onClickRemovePopup = this._onClickRemovePopup.bind(this);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
  }

  init(films) {
    this._sourcedlistFilms = films.slice();
    this._listFilms = films.slice();
    this._filterListFilms = films.slice();

    this._activeFilterFilms = `#all`;
    this._filmCardCount = FILM_CARD_COUNT;

    this._renderListFilms();
  }

  _renderNoData() {
    const siteFilmCardElement = this._sectionFilmsComponent.getElement().querySelector(`.films-list`)
      .querySelector(`.films-list__container`);

    this._noDataComponent = new NoDataView();

    render(siteFilmCardElement, this._noDataComponent, RenderPosition.AFTERBEGIN);
  }

  _removeNoData() {
    remove(this._noDataComponent);

    this._noDataComponent = null;
  }

  _renderProfileRating() {
    this._profileRatingComponent = new ProfileRatingView(this._sourcedlistFilms);

    render(this._head, this._profileRatingComponent, RenderPosition.BEFOREEND);
  }

  _renderSectionFilms() {
    render(this._container, this._sectionFilmsComponent, RenderPosition.BEFOREEND);
  }

  _renderFilter() {
    this._filterMenuComponent = new FilterMenuView(this._sourcedlistFilms);

    render(this._container, this._filterMenuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    render(this._container, this._sortMenuComponent, RenderPosition.BEFOREEND);
  }

  _renderStatistics() {
    render(this._container, this._statisticsComponent, RenderPosition.BEFOREEND);
  }

  _rendarCardFilm(film) {
    const siteFilmListElement = this._sectionFilmsComponent.getElement().querySelector(`.films-list`);
    const siteFilmCardElement = siteFilmListElement.querySelector(`.films-list__container`);

    render(siteFilmCardElement, new FilmCardView(film), RenderPosition.BEFOREEND);
  }

  _rendarCardFilms(from, to) {
    this._listFilms
      .slice(from, to)
      .forEach((film) => this._rendarCardFilm(film));
  }

  _handleLoadMoreButtonClick() {
    this._rendarCardFilms(this._renderedFilmsCount, this._renderedFilmsCount + FILM_CARD_COUNT);
    this._renderedFilmsCount += FILM_CARD_COUNT;

    if (this._renderedFilmsCount >= this._listFilms.length) {
      this._renderedFilmsCount = FILM_CARD_COUNT;

      remove(this._loadMoreButtonComponent);
      this._loadMoreButtonComponent = null;
    }
  }

  _renderLoadMoreButton() {
    const siteFilmListElement = this._sectionFilmsComponent.getElement().querySelector(`.films-list`);

    this._loadMoreButtonComponent = new ButtonView();

    render(siteFilmListElement, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
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

  _removeCardFilmsExtra() {
    const sectionsExtra = this._sectionFilmsComponent.getElement().querySelectorAll(`.films-list--extra`);

    for (let section of sectionsExtra) {
      const cardsExtra = section.querySelectorAll(`.film-card`);

      for (const card of cardsExtra) {
        card.remove();
      }
    }
  }

  _createCardFilms() {
    const siteFilmListElement = this._sectionFilmsComponent.getElement().querySelector(`.films-list`);
    const siteFilmCardElement = siteFilmListElement.querySelector(`.films-list__container`);

    if (this._listFilms.length && this._noDataComponent) {
      this._removeNoData();
    }

    this._filmCardCount = this._listFilms.length < FILM_CARD_COUNT ? this._listFilms.length : FILM_CARD_COUNT;

    for (let i = 0; i < this._filmCardCount; i++) {
      render(siteFilmCardElement, new FilmCardView(this._listFilms[i]), RenderPosition.BEFOREEND);
    }

    if (this._listFilms.length > FILM_CARD_COUNT) {
      this._renderLoadMoreButton();
    }
  }

  _removeCardFilms() {
    const cards = this._sectionFilmsComponent.getElement().querySelector(`.films-list`)
      .querySelector(`.films-list__container`)
      .querySelectorAll(`.film-card`);

    for (const card of cards) {
      card.remove();
    }

    if (this._loadMoreButtonComponent) {
      remove(this._loadMoreButtonComponent);
      this._loadMoreButtonComponent = null;
    }
  }

  _createStatistics() {
    if (!this._statisticsComponent) {
      this._sortMenuComponent.removeClickHandler(this._sortClickHandler);
      this._sectionFilmsComponent.removeClickHandler(this._onClickCreatePopup);

      this._removeCardFilms();
      this._removeCardFilmsExtra();

      if (this._noDataComponent) {
        this._removeNoData();
      }

      remove(this._sortMenuComponent);
      remove(this._sectionFilmsComponent);

      this._statisticsComponent = new StatisticsView();
      this._renderStatistics();

      const activeFilterButton = this._filterMenuComponent.getElement().querySelector(`.main-navigation__item--active`);

      activeFilterButton.classList.remove(`main-navigation__item--active`);
      this._filterMenuComponent.getElement().querySelector(`.main-navigation__additional`).classList.add(`main-navigation__item--active`);
    }
  }

  _sortsFilms(target, element) {
    if (!target.classList.contains(`sort__button--active`) && target.classList.contains(`sort__button`)) {
      const activeSorting = this._sortMenuComponent.getElement().querySelector(`.sort__button--active`);

      activeSorting.classList.remove(`sort__button--active`);
      target.classList.add(`sort__button--active`);

      if (this._listFilms.length) {
        this._removeCardFilms();

        this._listFilms = element ? sortElements(this._filterListFilms.slice(), element) : this._filterListFilms;

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
    if (this._statisticsComponent) {
      this._renderListFilms();
    }

    if (!target.classList.contains(`main-navigation__item--active`)) {
      this._filterListFilms = list !== `all` ? filter(this._sourcedlistFilms, list) : this._sourcedlistFilms;
      this._listFilms = this._filterListFilms;
      const activeFilterButton = this._filterMenuComponent.getElement().querySelector(`.main-navigation__item--active`);

      activeFilterButton.classList.remove(`main-navigation__item--active`);
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

      } else if (!this._noDataComponent) {
        this._removeCardFilms();
        this._renderNoData();
      }
    }
  }

  _filterClickHandler(evt) {
    evt.preventDefault();

    const target = evt.target;

    const href = target.getAttribute(`href`);

    switch (href) {
      case `#all`:
        this._activeFilterFilms = `#all`;
        return this._filtersFilms(target, `all`);
      case `#watchlist`:
        this._activeFilterFilms = `#watchlist`;
        return this._filtersFilms(target, `watchlist`);
      case `#history`:
        this._activeFilterFilms = `#history`;
        return this._filtersFilms(target, `history`);
      case `#favorites`:
        this._activeFilterFilms = `#favorites`;
        return this._filtersFilms(target, `favorites`);
      case `#stats`:
        return this._createStatistics();
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

      return;
    }

    this._onClickAddToList(evt);
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

  _addFilmToList(classList, index, list) {
    classList.toggle(`film-card__controls-item--active`);

    this._sourcedlistFilms[index][list] = !this._sourcedlistFilms[index][list];
    this._filterMenuComponent.removeClickHandler(this._filterClickHandler);
    remove(this._filterMenuComponent);
    this._renderFilter();
    this._filterMenuComponent.setClickHandler(this._filterClickHandler);

    if (list === `history`) {
      remove(this._profileRatingComponent);
      this._profileRatingComponent = null;

      this._renderProfileRating();
    }

    const activeFilterButton = this._filterMenuComponent.getElement().querySelector(`.main-navigation__item--active`);
    const filterNavigation = this._filterMenuComponent.getElement().querySelectorAll(`.main-navigation__item`);

    for (const item of filterNavigation) {
      if (item.getAttribute(`href`) === this._activeFilterFilms) {
        if (!item.classList.contains(`.main-navigation__item--active`)) {
          activeFilterButton.classList.remove(`main-navigation__item--active`);
          item.classList.add(`main-navigation__item--active`);
        }
      }
    }

    if (this._activeFilterFilms.replace(/^#/, ``) === list) {
      this._filterListFilms = list !== `all` ? filter(this._sourcedlistFilms, list) : this._sourcedlistFilms;
      this._listFilms = this._filterListFilms;

      this._removeCardFilms();
      this._createCardFilms();
      this._removeCardFilmsExtra();
      this._createCardFilmsExtra();
    }

    if (!this._listFilms.length) {
      this._removeCardFilms();
      this._renderNoData();
    }
  }

  _onClickAddToList(evt) {
    const targetClass = evt.target.classList;

    if (targetClass.contains(`film-card__controls-item`)) {
      const id = evt.target.closest(`.film-card`).dataset.id;
      const index = this._sourcedlistFilms.findIndex((element) => element.id === id);
      const content = evt.target.textContent;

      switch (content) {
        case `Add to watchlist`:
          return this._addFilmToList(targetClass, index, `watchlist`);
        case `Mark as watched`:
          return this._addFilmToList(targetClass, index, `history`);
        case `Mark as favorite`:
          return this._addFilmToList(targetClass, index, `favorites`);
      }
    }

    return null;
  }

  _renderListFilms() {
    if (!this._profileRatingComponent) {
      this._renderProfileRating();
    }

    this._renderSort();

    if (!this._listFilms.length) {
      this._renderNoData();
    }

    if (!this._statisticsComponent) {
      this._renderFilter();
      this._renderSort();
      this._renderSectionFilms();
      this._createCardFilmsExtra();
      this._createCardFilms();

      this._sortMenuComponent.setClickHandler(this._sortClickHandler);
      this._filterMenuComponent.setClickHandler(this._filterClickHandler);
      this._sectionFilmsComponent.setClickHandler(this._onClickCreatePopup);

    } else {
      remove(this._statisticsComponent);
      this._statisticsComponent = null;

      this._renderSectionFilms();
      this._createCardFilmsExtra();
      this._createCardFilms();

      this._sortMenuComponent.setClickHandler(this._sortClickHandler);
      this._sectionFilmsComponent.setClickHandler(this._onClickCreatePopup);
    }
  }
}
