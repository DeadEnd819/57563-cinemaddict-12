import ProfileRatingView from "../view/profile-rating.js";
import FilterMenuView from "../view/filter-menu.js";
import SortMenuView from "../view/sort-menu.js";
import SectionFilmsView from "../view/films.js";
import NoDataView from "../view/no-data.js";
import StatisticsView from "../view/statistics.js";
import ButtonView from "../view/button.js";
import {filter} from "../utils/filter.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {FILM_CARD_COUNT, Containers, SortType, FilterType} from "../utils/const.js";
import {sortElements} from "../utils/sort.js";
import FilmPresenter from "../presenter/film.js";

export default class MovieList {
  constructor(headContainer, mainContainer, footerContainer, bodyContainer) {
    this._head = headContainer;
    this._container = mainContainer;
    this._footer = footerContainer;
    this._body = bodyContainer;
    this._renderedFilmsCount = FILM_CARD_COUNT;
    this._mainFilmPresenters = {};
    this._filmPresenters = {};

    this._sectionFilmsComponent = new SectionFilmsView();
    this._filterMenuComponent = new FilterMenuView(this._sourcedlistFilms);
    this._sortMenuComponent = new SortMenuView();
    this._loadMoreButtonComponent = null;
    this._profileRatingComponent = null;
    this._filterMenuComponent = null;
    this._statisticsComponent = null;
    this._noDataComponent = null;

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._sortClickHandler = this._sortClickHandler.bind(this);
    this._filterClickHandler = this._filterClickHandler.bind(this);
    // this._onClickAddToList = this._onClickAddToList.bind(this);
  }

  init(films) {
    this._sourcedlistFilms = films.slice();
    this._listFilms = films.slice();
    this._filterListFilms = films.slice();
    this._activeFilterFilms = `#all`;
    this._activeSortFilm = SortType.DEFAULT;

    this._renderProfileRating();
    this._renderFilter();
    this._renderSort();
    this._renderSectionFilms();

    this._renderMain();
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

  _filtersFilms(target, list) {
    if (this._statisticsComponent) {
      this._renderListFilms();
    }

    if (!target.classList.contains(`main-navigation__item--active`)) {
      this._filterListFilms = list !== `all` ? filter(this._sourcedlistFilms, list) : this._sourcedlistFilms;
      this._listFilms = this._filterListFilms;
      this._filterMenuComponent.update(this._activeFilterFilms);

      this._sortMenuComponent.resetActiveButton();

      if (this._listFilms.length) {
        this._removeMainCardFilms();
        this._createMainCardFilms();

      } else if (!this._noDataComponent) {
        this._removeMainCardFilms();
        this._renderNoData();
      }
    }
  }

  _filterClickHandler(evt) {
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
    const container = this._sectionFilmsComponent.getElement().querySelector(`[data-type-container="main"]`);
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
        const filmPresenter = new FilmPresenter(this._onClickAddToList);

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

    this._createMainCardFilms();
    this._createTopCardFilms();
    this._createCommentedCardFilms();
  }
}
