import ProfileRatingView from "../view/profile-rating.js";
import FilterMenuView from "../view/filter-menu.js";
import SortMenuView from "../view/sort-menu.js";
import SectionFilmsView from "../view/films.js";
import NoDataView from "../view/no-data.js";
import StatisticsButtonView from "../view/statistics-button.js";
import StatisticsView from "../view/statistics.js";
import ButtonView from "../view/button.js";
import {updateItem} from "../utils/common.js";
import {filter} from "../utils/filter.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {FILM_CARD_COUNT, Containers, SortType, FilterType} from "../utils/const.js";
import {sortElements} from "../utils/sort.js";
import FilmPresenter from "../presenter/film.js";

export default class MovieList {
  constructor(headContainer, mainContainer) {
    this._head = headContainer;
    this._container = mainContainer;
    this._renderedFilmsCount = FILM_CARD_COUNT;
    this._mainFilmPresenters = {};
    this._filmPresenters = {};

    this._sectionFilmsComponent = new SectionFilmsView();
    this._filterMenuComponent = new FilterMenuView(this._sourcedlistFilms);
    this._sortMenuComponent = new SortMenuView();
    this._statisticsButtonComponent = new StatisticsButtonView();
    this._loadMoreButtonComponent = null;
    this._profileRatingComponent = null;
    this._filterMenuComponent = null;
    this._statisticsComponent = null;
    this._noDataComponent = null;

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._sortClickHandler = this._sortClickHandler.bind(this);
    this._filterClickHandler = this._filterClickHandler.bind(this);
    this._statisticsButtonClickHandler = this._statisticsButtonClickHandler.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleResetPopup = this._handleResetPopup.bind(this);
  }

  init(films) {
    this._sourcedlistFilms = films.slice();
    this._listFilms = films.slice();
    this._filterListFilms = films.slice();
    this._activeFilterFilms = FilterType.ALL;
    this._activeSortFilm = SortType.DEFAULT;

    this._renderProfileRating();
    this._renderFilter();
    this._renderStatisticsButton();
    this._renderSort();

    this._renderMain();
  }


  _handleResetPopup() {
    Object
      .values(this._filmPresenters)
      .forEach((presenter) => presenter.removePopup());
  }

  _handleFilmChange(updatedFilm, type) {
    this._listFilms = updateItem(this._listFilms, updatedFilm);
    this._sourcedlistFilms = updateItem(this._sourcedlistFilms, updatedFilm);
    this._filmPresenters[updatedFilm.id].update(updatedFilm);

    this._filterMenuComponent.update(this._sourcedlistFilms, type);

    if (this._activeFilterFilms !== FilterType.ALL) {
      this._rerenderMainCads(type);
    }
  }

  _rerenderMainCads(type) {
    if (this._activeFilterFilms === type) {
      this._filterListFilms = filter(this._sourcedlistFilms, type);
      this._listFilms = this._filterListFilms;
    }

    this._removeMainCardFilms();

    if (this._listFilms.length) {
      this._createMainCardFilms();
      return;
    }

    this._renderNoData();
  }

  _statisticsButtonClickHandler() {

    this._createStatistics();
  }

  _handleLoadMoreButtonClick() {
    const container = this._sectionFilmsComponent.getElement().querySelector(`[data-type-container="${Containers.MAIN}"]`);
    this._renderCards(container, this._renderedFilmsCount, this._renderedFilmsCount + FILM_CARD_COUNT, SortType.DEFAULT);
    this._renderedFilmsCount += FILM_CARD_COUNT;

    if (this._renderedFilmsCount >= this._listFilms.length) {
      this._renderedFilmsCount = FILM_CARD_COUNT;

      remove(this._loadMoreButtonComponent);
      this._loadMoreButtonComponent = null;
    }
  }

  _filtersFilms(list) {
    if (this._statisticsComponent) {
      this._removeStatistics();
      this._renderSort();
      this._renderMain();
    }

    this._filterListFilms = list !== FilterType.ALL ? filter(this._sourcedlistFilms, list) : this._sourcedlistFilms;
    this._listFilms = this._filterListFilms;
    this._sortMenuComponent.resetActiveButton();

    if (this._listFilms.length) {
      this._removeMainCardFilms();
      this._createMainCardFilms();

    } else if (!this._noDataComponent) {
      this._removeMainCardFilms();
      this._renderNoData();
    }
  }

  _filterClickHandler(type) {
    switch (type) {
      case FilterType.ALL:
        this._activeFilterFilms = FilterType.ALL;
        return this._filtersFilms(this._activeFilterFilms);
      case FilterType.WATCHLIST:
        this._activeFilterFilms = FilterType.WATCHLIST;
        return this._filtersFilms(this._activeFilterFilms);
      case FilterType.HISTORY:
        this._activeFilterFilms = FilterType.HISTORY;
        return this._filtersFilms(this._activeFilterFilms);
      case FilterType.FAVORITES:
        this._activeFilterFilms = FilterType.FAVORITES;
        return this._filtersFilms(this._activeFilterFilms);
      default:
        return null;
    }
  }

  _sortsFilms(activeSort) {
    this._removeMainCardFilms();
    this._listFilms = activeSort !== SortType.DEFAULT ? sortElements(this._filterListFilms.slice(), activeSort) : this._filterListFilms;
    this._createMainCardFilms();
  }

  _sortClickHandler(type) {
    switch (type) {
      case SortType.DEFAULT:
        this._activeSortFilm = SortType.DEFAULT;
        return this._sortsFilms(this._activeSortFilm);
      case SortType.YEAR:
        this._activeSortFilm = SortType.YEAR;
        return this._sortsFilms(this._activeSortFilm);
      case SortType.RATING:
        this._activeSortFilm = SortType.RATING;
        return this._sortsFilms(this._activeSortFilm);
      default:
        return null;
    }
  }

  _renderNoData() {
    const container = this._sectionFilmsComponent.getElement().querySelector(`[data-type-container="${Containers.MAIN}"]`);
    this._noDataComponent = new NoDataView();
    render(container, this._noDataComponent, RenderPosition.AFTERBEGIN);
  }

  _removeNoData() {
    remove(this._noDataComponent);

    this._noDataComponent = null;
  }

  _renderLoadMoreButton() {
    const siteFilmListElement = this._sectionFilmsComponent.getElement().querySelector(`.films-list`);

    this._loadMoreButtonComponent = new ButtonView();

    render(siteFilmListElement, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _renderProfileRating() {
    this._profileRatingComponent = new ProfileRatingView();
    this._profileRatingComponent.update(this._listFilms);
    render(this._head, this._profileRatingComponent, RenderPosition.BEFOREEND);
  }

  _renderFilter() {
    this._filterMenuComponent = new FilterMenuView(this._sourcedlistFilms);
    render(this._container, this._filterMenuComponent, RenderPosition.AFTERBEGIN);
    this._filterMenuComponent.setClickHandler(this._filterClickHandler);
  }

  _renderSort() {
    render(this._container, this._sortMenuComponent, RenderPosition.BEFOREEND);
    this._sortMenuComponent.setClickHandler(this._sortClickHandler);
  }

  _renderSectionFilms() {
    render(this._container, this._sectionFilmsComponent, RenderPosition.BEFOREEND);
  }

  _renderStatisticsButton() {
    render(this._filterMenuComponent.getElement(), this._statisticsButtonComponent, RenderPosition.BEFOREEND);
    this._statisticsButtonComponent.setClickHandler(this._statisticsButtonClickHandler);
  }

  _renderStatistics() {
    render(this._container, this._statisticsComponent, RenderPosition.BEFOREEND);
  }

  _createStatistics() {
    if (!this._statisticsComponent) {
      if (this._noDataComponent) {
        this._removeNoData();
      }

      this._sortMenuComponent.removeClickHandler(this._sortClickHandler);

      remove(this._sortMenuComponent);
      remove(this._sectionFilmsComponent);

      this._statisticsComponent = new StatisticsView();
      this._renderStatistics();

      const activeFilterButton = this._filterMenuComponent.getElement().querySelector(`.main-navigation__item--active`);

      activeFilterButton.classList.remove(`main-navigation__item--active`);
      this._filterMenuComponent.getElement().querySelector(`.main-navigation__additional`).classList.add(`main-navigation__item--active`);
    }
  }

  _removeStatistics() {
    remove(this._statisticsComponent);
    this._statisticsComponent = null;
  }

  _prepareListFilms(type) {
    const list = this._listFilms.slice();

    switch (type) {
      case SortType.RATING:
        return sortElements(list, SortType.RATING).slice(0, 2);
      case SortType.COMMENTS:
        return sortElements(list, SortType.COMMENTS).slice(0, 2);
      default:
        return list;
    }
  }

  _renderCards(container, from, to, type) {
    const list = this._prepareListFilms(type);
    const fragment = new DocumentFragment();

    list
      .slice(from, to)
      .forEach((film) => {
        const filmPresenter = new FilmPresenter(this._handleFilmChange, this._handleResetPopup);

        const card = filmPresenter.init(film);
        fragment.append(card);

        this._filmPresenters[film.id] = filmPresenter;

        if (type === SortType.DEFAULT) {
          this._mainFilmPresenters[film.id] = filmPresenter;
        }
      });

    render(container, fragment, RenderPosition.BEFOREEND);
  }

  _createMainCardFilms() {
    if (this._listFilms.length && this._noDataComponent) {
      this._removeNoData();
    }

    const container = this._sectionFilmsComponent.getElement().querySelector(`[data-type-container="${Containers.MAIN}"]`);
    this._renderCards(container, 0, Math.min(this._listFilms.length, FILM_CARD_COUNT), SortType.DEFAULT);

    if (this._listFilms.length > FILM_CARD_COUNT) {
      this._renderLoadMoreButton();
    }
  }

  _removeMainCardFilms() {
    Object
      .values(this._mainFilmPresenters)
      .forEach((presenter) => presenter.destroy());
    this._mainFilmPresenters = {};
    this._renderedFilmsCount = FILM_CARD_COUNT;

    if (this._loadMoreButtonComponent) {
      remove(this._loadMoreButtonComponent);
      this._loadMoreButtonComponent = null;
    }
  }

  // _removeExtraCardFilms() {
  //   Object
  //     .values(this._filmPresenters)
  //     .forEach((presenter) => presenter.destroy());
  //   this._filmPresenters = {};
  // }

  _createTopCardFilms() {
    const container = this._sectionFilmsComponent.getElement()
      .querySelector(`[data-type-container="${Containers.TOP}"]`);
    this._renderCards(container, 0, Math.min(this._listFilms.length, FILM_CARD_COUNT), SortType.RATING);
  }

  _createCommentedCardFilms() {
    const container = this._sectionFilmsComponent.getElement()
      .querySelector(`[data-type-container="${Containers.COMMENTED }"]`);
    this._renderCards(container, 0, Math.min(this._listFilms.length, FILM_CARD_COUNT), SortType.COMMENTS);
  }

  _renderMain() {
    if (!this._listFilms.length) {
      this._renderNoData();
      return;
    }

    this._renderSectionFilms();
    this._createMainCardFilms();
    this._createTopCardFilms();
    this._createCommentedCardFilms();
  }
}
