import {getRandomInteger} from "../utils/common.js";

const generateEmoji = () => {
  const emojis = [
    `./images/emoji/smile.png`,
    `./images/emoji/sleeping.png`,
    `./images/emoji/puke.png`,
    `./images/emoji/angry.png`,
  ];

  const randomIndex = getRandomInteger(0, emojis.length - 1);

  return emojis[randomIndex];
};

const generateText = () => {
  const texts = [
    `Interesting setting and a good cast`,
    `Booooooooooring`,
    `Very very old. Meh`,
    `Almost two hours? Seriously?`,
    `Good movie!`,
  ];

  const randomIndex = getRandomInteger(0, texts.length - 1);

  return texts[randomIndex];
};

const generateAuthor = () => {
  const authors = [
    `John Doe`,
    `Tim Macoveev`,
    `Anna Ross`,
    `Kimberly Mason`,
    `Constance London`,
    `Andrew Grant`,
    `Cliff Birds`,
  ];

  const randomIndex = getRandomInteger(0, authors.length - 1);

  return authors[randomIndex];
};

const generateDateComment = () => {
  const randomDate = new Date(getRandomInteger(1920, 2020), getRandomInteger(0, 11),
      getRandomInteger(1, 31), getRandomInteger(0, 23), getRandomInteger(0, 59));

  return randomDate;
};

export const generateComment = () => {
  return {
    emoji: generateEmoji(),
    text: generateText(),
    author: generateAuthor(),
    day: generateDateComment(),
  };
};
