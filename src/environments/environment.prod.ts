export const environment = {
  apiUrl: 'https://movies.dsw.mywire.org/api',
  loginUrl: function () {
    return this.apiUrl + '/login';
  },
  imageBaseUrl: 'https://image.tmdb.org/t/p/',
};
