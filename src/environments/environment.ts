// environment.ts (for development)
import { environmentBase } from './environment.base';

export const environment = {
  ...environmentBase,
  apiUrl: 'http://192.168.10.6:8080',
  // apiUrl: 'https://movies.deltasw.eu/api',
};
