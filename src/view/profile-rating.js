import {filter} from "../utils/filter.js";
import {FilterType, UserRating} from "../utils/const.js";
import AbstractView from "./abstract.js";

const createProfileRatingTemplate = (rating) => {
  return (
    `<section class="header__profile profile">
       <p class="profile__rating">${rating}</p>
       <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
     </section>`
  );
};

export default class ProfileRating extends AbstractView {
  constructor() {
    super();

    this._films = null;
    this._profileRating = UserRating.NONE;
  }

  getTemplate() {
    return createProfileRatingTemplate(this._profileRating);
  }

  update(film) {
    this._films = film;
    const profileRatingElement = this.getElement().querySelector(`.profile__rating`);
    const historiFilmsCount = filter(this._films, FilterType.HISTORY).length;

    if (historiFilmsCount !== 0 && historiFilmsCount <= 10) {
      this._profileRating = UserRating.NOVICE;
    } else if (historiFilmsCount > 10 && historiFilmsCount <= 20) {
      this._profileRating = UserRating.FAN;
    } else if (historiFilmsCount > 20) {
      this._profileRating = UserRating.MOVIE_BUFF;
    } else {
      this._profileRating = UserRating.NONE;
    }

    profileRatingElement.textContent = this._profileRating;
  }
}
