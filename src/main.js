import {createUserRankTemplate} from "./view/user-rank.js";
import {createMainMenuTemplate} from "./view/main-menu.js";
import {createSectionFilmsTemplate} from "./view/films.js";
import {createFilmCardTemplate} from "./view/card.js";
import {createButtonTemplate} from "./view/button.js";
import {createFooterStatisticsTemplate} from "./view/statistics.js";

const FILM_CARD_COUNT = 5;
const FILM_CARD_EXTRA_COUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, createUserRankTemplate(), `beforeend`);

const siteMainElement = document.querySelector(`.main`);

render(siteMainElement, createMainMenuTemplate(), `beforeend`);
render(siteMainElement, createSectionFilmsTemplate(), `beforeend`);

const siteFilmListElement = siteMainElement.querySelector(`.films-list`);

render(siteFilmListElement, createButtonTemplate(), `beforeend`);

const siteFooterStatisticsElement = document.querySelector(`.footer__statistics`);

render(siteFooterStatisticsElement, createFooterStatisticsTemplate(), `beforeend`);

const siteFilmCardElement = siteMainElement.querySelectorAll(`.films-list__container`);

for (const element of siteFilmCardElement) {
  const COUNT = siteFilmCardElement[0] === element ? FILM_CARD_COUNT : FILM_CARD_EXTRA_COUNT;

  for (let i = 0; i < COUNT; i++) {
    render(element, createFilmCardTemplate(), `beforeend`);
  }
}

