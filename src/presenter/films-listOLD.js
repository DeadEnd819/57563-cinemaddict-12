import ProfileRatingView from "../view/profile-rating.js";
import FilterMenuView from "../view/filter-menu.js";
import SortMenuView from "../view/sort-menu.js";
import SectionFilmsView from "../view/films.js";
import NoDataView from "../view/no-data.js";
import StatisticsView from "../view/statistics.js";
import ButtonView from "../view/button.js";
import {filter} from "../utils/filter.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {FilterType} from "../utils/const.js";
import {sortElements} from "../utils/sort.js";
import FilmPresenter from "../presenter/film.js";

const FILM_CARD_COUNT = 5;

export default class MovieList {
  constructor(head, main, footer, body) {
    this._head = head;
    this._container = main;
    this._footer = footer;
    this._body = body;
    this._renderedFilmsCount = FILM_CARD_COUNT;
    this._filmPresenter = {};
    this._topRatedPresenter = {};
    this._mostCommentedPresenter = {};

    this._sectionFilmsComponent = new SectionFilmsView();
    this._sortMenuComponent = new SortMenuView();
    this._profileRatingComponent = null;
    this._filterMenuComponent = null;
    this._statisticsComponent = null;
    this._noDataComponent = null;
    this._loadMoreButtonComponent = null;

    this._sortClickHandler = this._sortClickHandler.bind(this);
    this._filterClickHandler = this._filterClickHandler.bind(this);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._onClickAddToList = this._onClickAddToList.bind(this);
  }

  init(films) {
    this._sourcedlistFilms = films.slice();
    this._listFilms = films.slice();
    this._filterListFilms = films.slice();

    this._activeFilterFilms = `#all`;
    this._activeSortFilm = ``;

    this._renderListFilms();
  }

  // _sortsFilms(target, element) {
  //   if (!target.classList.contains(`sort__button--active`) && target.classList.contains(`sort__button`)) {
  //     const activeSorting = this._sortMenuComponent.getElement().querySelector(`.sort__button--active`);
  //
  //     activeSorting.classList.remove(`sort__button--active`);
  //     target.classList.add(`sort__button--active`);
  //
  //     if (this._listFilms.length) {
  //       this._removeCardFilms();
  //
  //       this._listFilms = element ? sortElements(this._filterListFilms.slice(), element) : this._filterListFilms;
  //
  //       this._createCardFilms();
  //     }
  //   }
  // }
  //
  // _sortClickHandler(evt) {
  //   evt.preventDefault();
  //
  //   const target = evt.target;
  //
  //   switch (target.textContent) {
  //     case `Sort by default`:
  //       this._activeSortFilm = ``;
  //       return this._sortsFilms(target);
  //     case `Sort by date`:
  //       this._activeSortFilm = `year`;
  //       return this._sortsFilms(target, `year`);
  //     case `Sort by rating`:
  //       this._activeSortFilm = `rating`;
  //       return this._sortsFilms(target, `rating`);
  //     default:
  //       return null;
  //   }
  // }

  // _filtersFilms(target, list) {
  //   if (this._statisticsComponent) {
  //     this._renderListFilms();
  //   }
  //
  //   if (!target.classList.contains(`main-navigation__item--active`)) {
  //     this._filterListFilms = list !== `all` ? filter(this._sourcedlistFilms, list) : this._sourcedlistFilms;
  //     this._listFilms = this._filterListFilms;
  //     this._filterMenuComponent.update(this._activeFilterFilms);
  //     const sortButtons = this._sortMenuComponent.getElement().querySelectorAll(`a`);
  //
  //     for (const button of sortButtons) {
  //       if (button.textContent === `Sort by default`) {
  //         button.classList.add(`sort__button--active`);
  //       } else {
  //         button.classList.remove(`sort__button--active`);
  //       }
  //     }
  //
  //     if (this._listFilms.length) {
  //       this._removeCardFilms();
  //       this._createCardFilms();
  //
  //     } else if (!this._noDataComponent) {
  //       this._removeCardFilms();
  //       this._renderNoData();
  //     }
  //   }
  // }
  //
  // _filterClickHandler(evt) {
  //   evt.preventDefault();
  //
  //   const target = evt.target;
  //
  //   const href = target.getAttribute(`href`);
  //
  //   switch (href) {
  //     case `#all`:
  //       this._activeFilterFilms = `#all`;
  //       return this._filtersFilms(target, `all`);
  //     case `#watchlist`:
  //       this._activeFilterFilms = `#watchlist`;
  //       return this._filtersFilms(target, `watchlist`);
  //     case `#history`:
  //       this._activeFilterFilms = `#history`;
  //       return this._filtersFilms(target, `history`);
  //     case `#favorites`:
  //       this._activeFilterFilms = `#favorites`;
  //       return this._filtersFilms(target, `favorites`);
  //     case `#stats`:
  //       return this._createStatistics();
  //     default:
  //       return null;
  //   }
  // }

  // _handleLoadMoreButtonClick() {
  //   const container = this._sectionFilmsComponent.getElement().querySelector(`[data-type-container="main"]`);
  //
  //   this._renderCards(container, this._renderedFilmsCount, this._renderedFilmsCount + FILM_CARD_COUNT);
  //   this._renderedFilmsCount += FILM_CARD_COUNT;
  //
  //   if (this._renderedFilmsCount >= this._listFilms.length) {
  //     this._renderedFilmsCount = FILM_CARD_COUNT;
  //
  //     remove(this._loadMoreButtonComponent);
  //     this._loadMoreButtonComponent = null;
  //   }
  // }

  _addFilmToList(target, list) {
    const id = target.tagName === `BUTTON` ? target.closest(`.film-card`).dataset.id : target.closest(`.film-details`).dataset.id;
    const index = this._sourcedlistFilms.findIndex((element) => element.id === id);

    this._filmPresenter[id].getCardComponent().setFilmButtonActive(list);

    if (this._filmPresenter[id].getPopupComponent()) {
      this._filmPresenter[id].getPopupComponent().setFilmButtonActive(list);
    }

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

    this._filterMenuComponent.update(this._activeFilterFilms);

    if (this._activeFilterFilms.replace(/^#/, ``) === list) {
      this._filterListFilms = list !== `all` ? filter(this._sourcedlistFilms, list) : this._sourcedlistFilms;
      this._listFilms = this._filterListFilms;

      this._filmPresenter[id].toggleStatusCard(id);
      const container = this._sectionFilmsComponent.getElement().querySelector(`[data-type-container="main"]`);
      this._renderCards(container, --this._renderedFilmsCount, ++this._renderedFilmsCount);

      if (this._filmPresenter[id].getStatusCard()) {
        this._removeCardFilms();
        this._createCardFilms();
      }

      this._removeCardFilmsExtra();
      this._createCardFilmsExtra();
    }

    if (!this._listFilms.length) {
      this._removeCardFilms();
      this._renderNoData();
    }
  }

  _onClickAddToList(evt) {
    const list = evt.target.dataset.list;

    switch (list) {
      case `watchlist`:
        return this._addFilmToList(evt.target, `watchlist`);
      case `history`:
        return this._addFilmToList(evt.target, `history`);
      case `favorites`:
        return this._addFilmToList(evt.target, `favorites`);
      default:
        return null;
    }
  }

  // _renderNoData() {
  //   const siteFilmCardElement = this._sectionFilmsComponent.getElement().querySelector(`.films-list`)
  //     .querySelector(`.films-list__container`);
  //
  //   this._noDataComponent = new NoDataView();
  //
  //   render(siteFilmCardElement, this._noDataComponent, RenderPosition.AFTERBEGIN);
  // }
  //
  // _removeNoData() {
  //   remove(this._noDataComponent);
  //
  //   this._noDataComponent = null;
  // }

  _renderStatistics() {
    render(this._container, this._statisticsComponent, RenderPosition.BEFOREEND);
  }

  _createStatistics() {
    if (!this._statisticsComponent) {
      this._sortMenuComponent.removeClickHandler(this._sortClickHandler);

      this._removeCardFilms();
      // this._removeCardFilmsExtra();

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

  // _renderProfileRating() {
  //   this._profileRatingComponent = new ProfileRatingView(this._sourcedlistFilms);
  //
  //   render(this._head, this._profileRatingComponent, RenderPosition.BEFOREEND);
  // }

  // _renderFilter() {
  //   this._filterMenuComponent = new FilterMenuView(this._sourcedlistFilms);
  //   render(this._container, this._filterMenuComponent, RenderPosition.AFTERBEGIN);
  //   this._filterMenuComponent.setClickHandler(this._filterClickHandler);
  // }

  // _renderSort() {
  //   render(this._container, this._sortMenuComponent, RenderPosition.BEFOREEND);
  //   this._sortMenuComponent.setClickHandler(this._sortClickHandler);
  // }

  // _renderSectionFilms() {
  //   render(this._container, this._sectionFilmsComponent, RenderPosition.BEFOREEND);
  // }

  // _renderLoadMoreButton() {
  //   const siteFilmListElement = this._sectionFilmsComponent.getElement().querySelector(`.films-list`);
  //
  //   this._loadMoreButtonComponent = new ButtonView();
  //
  //   render(siteFilmListElement, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);
  //
  //   this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
  // }

  // _renderCard(film, container) {
  //   if (!this._filmPresenter[film.id]) {
  //     const filmPresenter = new FilmPresenter(container, this._footer, this._body, this._onClickAddToList);
  //
  //     filmPresenter.init(film);
  //     this._filmPresenter[film.id] = filmPresenter;
  //     return;
  //   }
  //
  //   this._filmPresenter[film.id].toggleStatusCard(film.id);
  // }
  //
  // _renderCards(container, from, to) {
  //   this._listFilms
  //     .slice(from, to)
  //     .forEach((film) => this._renderCard(film, container));
  // }
  //
  // _createCardFilmsExtra() {
  //   const filmsTopRated = sortElements(this._sourcedlistFilms.slice(), `rating`).slice(0, 2);
  //   const filmsMostCommented = sortElements(this._sourcedlistFilms.slice(), `comments`).slice(0, 2);
  //   const siteFilmExtraCardElements = this._sectionFilmsComponent.getElement().querySelectorAll(`.films-list--extra`);
  //   const siteFilmTopRatedElement = siteFilmExtraCardElements[0].lastElementChild;
  //
  //   for (const film of filmsTopRated) {
  //     const filmPresenter = new FilmPresenter(siteFilmTopRatedElement, this._footer, this._body, this._onClickAddToList);
  //
  //     filmPresenter.init(film);
  //     this._topRatedPresenter[film.id] = filmPresenter;
  //   }
  //
  //   // this._createdCardFilmsTopRated();
  //
  //   const siteFilmMostCommentedElement = siteFilmExtraCardElements[1].lastElementChild;
  //
  //   for (const film of filmsMostCommented) {
  //     const filmPresenter = new FilmPresenter(siteFilmMostCommentedElement, this._footer, this._body, this._onClickAddToList);
  //
  //     filmPresenter.init(film);
  //     this._mostCommentedPresenter[film.id] = filmPresenter;
  //   }
  // }

  // _removeCardFilmsExtra() {
  //   Object
  //     .values(this._topRatedPresenter)
  //     .forEach((presenter) => presenter.destroy());
  //   this._topRatedPresenter = {};
  //
  //   Object
  //     .values(this._mostCommentedPresenter)
  //     .forEach((presenter) => presenter.destroy());
  //   this._mostCommentedPresenter = {};
  // }

  // _createCardFilms() {
  //   if (this._listFilms.length && this._noDataComponent) {
  //     this._removeNoData();
  //   }
  //
  //   const container = this._sectionFilmsComponent.getElement().querySelector(`[data-type-container="main"]`);
  //
  //   this._renderCards(container, 0, Math.min(this._listFilms.length, FILM_CARD_COUNT));
  //
  //   if (this._listFilms.length > FILM_CARD_COUNT) {
  //     this._renderLoadMoreButton();
  //   }
  // }

  // _removeCardFilms() {
  //   Object
  //     .values(this._filmPresenter)
  //     .forEach((presenter) => presenter.destroy());
  //   this._filmPresenter = {};
  //   this._renderedFilmsCount = FILM_CARD_COUNT;
  //
  //   if (this._loadMoreButtonComponent) {
  //     remove(this._loadMoreButtonComponent);
  //     this._loadMoreButtonComponent = null;
  //   }
  // }
  //  ==================================================================
  // _createdCardFilmsTopRated() {
  //   const filmsTopRated = sortElements(this._sourcedlistFilms.slice(), `rating`).slice(0, 2);
  //   const container = this._sectionFilmsComponent.getElement().querySelector(`[data-type-container="rated"]`);
  //
  //   filmsTopRated.forEach((film) => {
  //     if (this._filmPresenter[film.id]) {
  //       this._topRatedPresenter[film.id] = this._filmPresenter[film.id];
  //       this._topRatedPresenter[film.id].renderFilm(container);
  //       return;
  //     }
  //
  //     this._renderCard(film, container, this._topRatedPresenter);
  //   });
  // }
  // _createdMostCommentedRated() {
  //
  // }
  //  ==================================================================
//   _renderListFilms() {
//     if (!this._profileRatingComponent) {
//       this._renderProfileRating();
//     }
//
//     if (!this._listFilms.length) {
//       this._renderFilter();
//       this._renderSort();
//       this._renderNoData();
//       return;
//     }
//
//     if (this._noDataComponent) {
//       this._removeNoData();
//     }
//
//     if (!this._statisticsComponent) {
//       this._renderFilter();
//       this._renderSort();
//       this._renderSectionFilms();
//       this._createCardFilms();
//       this._createCardFilmsExtra();
//       return;
//     }
//
//     remove(this._statisticsComponent);
//     this._statisticsComponent = null;
//
//     this._renderSort();
//     this._renderSectionFilms();
//     this._createCardFilms();
//     this._createCardFilmsExtra();
//   }
// }
