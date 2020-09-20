import {filter} from "../utils/filter.js";
import AbstractView from "./abstract.js";

const createProfileRatingTemplate = (films) => {
  const historiFilmsCount = filter(films, `history`).length;
  let profileRating = ``;

  if (historiFilmsCount !== 0 && historiFilmsCount <= 10) {
    profileRating = `Novice`;
  } else if (historiFilmsCount > 10 && historiFilmsCount <= 20) {
    profileRating = `Fan`;
  } else if (historiFilmsCount > 20) {
    profileRating = `Movie Buff`;
  } else {
    profileRating = ``;
  }

  return (
    `<section class="header__profile profile">
       <p class="profile__rating">${profileRating}</p>
       <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
     </section>`
  );
};

export default class ProfileRating extends AbstractView {
  constructor(films) {
    super();

    this._films = films;
  }

  getTemplate() {
    return createProfileRatingTemplate(this._films);
  }
}
