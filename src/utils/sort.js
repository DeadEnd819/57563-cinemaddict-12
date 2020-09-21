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
