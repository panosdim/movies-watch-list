// environment.ts (for development)
import { environmentBase } from './environment.base';

export const environment = {
  ...environmentBase,
  apiUrl: 'http://localhost:8080',
  // apiUrl: 'https://movies.deltasw.eu/api',
};
