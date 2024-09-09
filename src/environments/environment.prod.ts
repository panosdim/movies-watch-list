// environment.prod.ts (for production)
import { environmentBase } from './environment.base';

export const environment = {
  ...environmentBase,
  apiUrl: 'https://movies.dsw.mywire.org/api', // Override for production
};
