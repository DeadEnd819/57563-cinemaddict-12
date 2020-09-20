import FooterStatisticsView from "./view/footer-statistics.js";
import MovieListPresenter from "./presenter/films-list.js";
import {generateFilm} from "./mock/card.js";
import {render, RenderPosition} from "./utils/render.js";

const FILM_COUNT = 25;

export const dataFilms = new Array(FILM_COUNT).fill().map(generateFilm);

const siteHeaderElement = document.querySelector(`.header`);
const siteFooterStatisticsElement = document.querySelector(`.footer__statistics`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const siteBodyElement = document.querySelector(`body`);

render(siteFooterStatisticsElement, new FooterStatisticsView(), RenderPosition.BEFOREEND);

const movieListPresenter = new MovieListPresenter(siteHeaderElement, siteMainElement, siteFooterElement, siteBodyElement);

movieListPresenter.init(dataFilms);
