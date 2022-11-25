export const environment = {
  apiUrl: 'http://localhost:8001/api',
  // apiUrl: 'https://movies.dsw.mywire.org/api',
  loginUrl: function () {
    return this.apiUrl + '/login';
  },
  popularUrl: function () {
    return this.apiUrl + '/popular';
  },
  searchUrl: function () {
    return this.apiUrl + '/search';
  },
  autocompleteUrl: function () {
    return this.apiUrl + '/autocomplete';
  },
  imageBaseUrl: 'https://image.tmdb.org/t/p/',
};
