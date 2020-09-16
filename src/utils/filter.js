import {dataFilms} from "../main.js";

export const filterByWatch = () => dataFilms.slice().filter((film) => film.watchlist);
export const filterByHistory = () => dataFilms.slice().filter((film) => film.history);
export const filterByFavorites = () => dataFilms.slice().filter((film) => film.favorites);
