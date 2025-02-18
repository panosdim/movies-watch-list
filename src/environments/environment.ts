// environment.ts (for development)
import { environmentBase } from './environment.base';

export const environment = {
  ...environmentBase,
  // apiUrl: 'http://localhost:8001/api',
  apiUrl: 'https://movies.dsw.mywire.org/api',
};
