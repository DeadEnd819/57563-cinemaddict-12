export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};

export const humanizeReleaseDate = (releaseDate) => {
  return [
    releaseDate.toLocaleString(`en-US`, {day: `2-digit`}),
    releaseDate.toLocaleString(`en-US`, {month: `long`}),
    releaseDate.toLocaleString(`en-US`, {year: `numeric`}),
  ].join(` `);
};

export const sortElements = (films, element) => {
  films.sort(function (a, b) {
    if (a[element] < b[element]) {
      return 1;
    }
    if (a[element] > b[element]) {
      return -1;
    }
    return 0;
  });

  return films;
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};
