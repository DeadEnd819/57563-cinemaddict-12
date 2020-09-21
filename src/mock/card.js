import {getRandomInteger, getRandomArbitrary, humanizeReleaseDate} from "../utils/common.js";
import {generateComment} from "./comment.js";

let filmId = 0;

const generateTitle = () => {
  const titles = [
    `The Dance of Life`,
    `Sagebrush Trail`,
    `The Man with the Golden Arm`,
    `Santa Claus Conquers the Martians`,
    `Popeye the Sailor Meets Sindbad the Sailor`,
    `The Man with the Golden Arm`,
    `The Great Flamarion`,
    `Santa Claus Conquers the Martians`,
    `Made for Each Other`,
  ];

  const randomIndex = getRandomInteger(0, titles.length - 1);

  return titles[randomIndex];
};

const generatePoster = () => {
  const posters = [
    `./images/posters/the-dance-of-life.jpg`,
    `./images/posters/sagebrush-trail.jpg`,
    `./images/posters/the-man-with-the-golden-arm.jpg`,
    `./images/posters/santa-claus-conquers-the-martians.jpg`,
    `./images/posters/popeye-meets-sinbad.png`,
    `./images/posters/the-man-with-the-golden-arm.jpg`,
    `./images/posters/the-great-flamarion.jpg`,
    `./images/posters/santa-claus-conquers-the-martians.jpg`,
    `./images/posters/made-for-each-other.png`
  ];

  const randomIndex = getRandomInteger(0, posters.length - 1);

  return posters[randomIndex];
};

const generateRating = () => {
  const rating = [0.1, 10];

  return getRandomArbitrary(rating[0], rating[1]).toFixed(1);
};

const generateRandomDate = () => {
  const randomDate = new Date(getRandomInteger(1920, 2020), getRandomInteger(0, 11), getRandomInteger(1, 31));

  return randomDate;
};

const generateDuration = () => {
  const duration = new Date();

  duration.setHours(getRandomInteger(0, 23));
  duration.setMinutes(getRandomInteger(0, 59));

  return duration;
};

const generateGenre = () => {
  const genres = [`Musical`, `Western`, `Drama`, `Comedy`, `Cartoon`, `Mystery`, `Film-Noir`];

  const randomCount = getRandomInteger(1, 3);
  const genreList = new Set();

  while (genreList.size < randomCount) {
    genreList.add(genres[getRandomInteger(0, genres.length - 1)]);
  }

  return [...genreList];
};


const generateDescription = () => {
  const descriptions = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ];

  const randomCount = getRandomInteger(1, 5);

  let description = new Set();
  while (description.size < randomCount) {
    const randomIndex = getRandomInteger(0, descriptions.length - 1);
    description.add(descriptions[randomIndex]);
  }

  return [...description].join(` `);
};

const generateCountry = () => {
  const countrys = [`USA`, `Germany`, `Australia`, `England`, `France`];

  const randomIndex = getRandomInteger(0, countrys.length - 1);

  return countrys[randomIndex];
};

const generateAgeRating = () => {
  const ratingList = [`0+`, `6+`, `12+`, `16+`, `18+`];

  const randomIndex = getRandomInteger(0, ratingList.length - 1);

  return ratingList[randomIndex];
};

const generateNames = (maxCount = 1) => {
  const nameList = [`Anthony Mann`, `Anne Wigton`, `Heinz Herald`, `Richard Weil`, `Erich von Stroheim`, `Mary Beth Hughes`, `Dan Duryea`];
  const countNames = maxCount === 1 ? maxCount : getRandomInteger(1, maxCount);
  const names = new Set();

  while (names.size < countNames) {
    const randomIndex = getRandomInteger(0, nameList.length - 1);
    names.add(nameList[randomIndex]);
  }

  return [...names];
};

export const generateFilm = () => {
  const newDate = generateRandomDate();
  const comments = [];
  const commentsCount = getRandomInteger(1, 5);

  for (let i = 0; i < commentsCount; i++) {
    comments.push(generateComment());
  }

  return {
    title: generateTitle(),
    poster: generatePoster(),
    rating: generateRating(),
    release: humanizeReleaseDate(newDate),
    year: newDate,
    duration: generateDuration(),
    genres: generateGenre(),
    description: generateDescription(),
    country: generateCountry(),
    ageRating: generateAgeRating(),
    director: generateNames(),
    writers: generateNames(3),
    actors: generateNames(3),
    comments,
    watchlist: Boolean(getRandomInteger(0, 1)),
    history: Boolean(getRandomInteger(0, 1)),
    favorites: Boolean(getRandomInteger(0, 1)),
    id: `film_` + filmId++,
  };
};
