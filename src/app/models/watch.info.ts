import { WatchProvider } from './watch.provider';

export type WatchedInfo = {
  rent: WatchProvider[] | null;
  buy: WatchProvider[] | null;
  flatrate: WatchProvider[] | null;
};
