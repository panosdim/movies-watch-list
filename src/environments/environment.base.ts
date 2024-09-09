// environment.base.ts
export const environmentBase = {
  apiUrl: '', // Placeholder to be overridden
  imageBaseUrl: 'https://image.tmdb.org/t/p/',

  loginUrl() {
    return this.apiUrl + '/login';
  },
  popularUrl() {
    return this.apiUrl + '/popular';
  },
  searchUrl() {
    return this.apiUrl + '/search';
  },
  autocompleteUrl() {
    return this.apiUrl + '/autocomplete';
  },
  watchlistUrl() {
    return this.apiUrl + '/watchlist';
  },
  moviesUrl() {
    return this.apiUrl + '/movies';
  },
  updateReleaseDatesUrl() {
    return this.apiUrl + '/update';
  },
};
