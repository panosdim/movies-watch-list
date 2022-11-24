export const environment = {
  // apiUrl: 'http://localhost:8001/api',
  apiUrl: 'https://movies.dsw.mywire.org/api',
  loginUrl: function () {
    return this.apiUrl + '/login';
  },
  popularUrl: function () {
    return this.apiUrl + '/popular';
  },
  imageBaseUrl: 'https://image.tmdb.org/t/p/',
};
