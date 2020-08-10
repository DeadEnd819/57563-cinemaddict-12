import {getRandomInteger, getRandomArbitrary, humanizeReleaseDate} from "../utils.js";

const generateTitle = () => {
  const title = [
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

  const randomIndex = getRandomInteger(0, title.length - 1);

  return title[randomIndex];
};

const generatePoster = () => {
  const poster = [
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

  const randomIndex = getRandomInteger(0, poster.length - 1);

  return poster[randomIndex];
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
  const genre = [`Musical`, `Western`, `Drama`, `Comedy`, `Cartoon`, `Mystery`];

  const randomIndex = getRandomInteger(0, genre.length - 1);

  return genre[randomIndex];
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

const generateCountComments = () => {
  return getRandomInteger(0, 5);
};

// const comment = {
//   emoji: [
//     `./images/emoji/smile.png`,
//     `./images/emoji/sleeping.png`,
//     `./images/emoji/puke.png`,
//     `./images/emoji/angry.png`,
//   ],
//   text: [
//     `Interesting setting and a good cast`,
//     `Booooooooooring`,
//     `Very very old. Meh`,
//     `Almost two hours? Seriously?`,
//     `Good movie!`,
//   ],
//   info: {
//     author: [
//       `John Doe`,
//       `Tim Macoveev`,
//     ],
//     day: [
//       `2019/12/31 23:59`,
//       `2 days ago`,
//       `Today`,
//     ],
//   }
// };

export const generateFilm = () => {
  const newDate = generateRandomDate();

  return {
    title: generateTitle(),
    poster: generatePoster(),
    rating: generateRating(),
    release: humanizeReleaseDate(newDate),
    year: generateRandomDate(),
    duration: generateDuration(),
    genre: generateGenre(),
    description: generateDescription(),
    comments: generateCountComments(),
  };
};
