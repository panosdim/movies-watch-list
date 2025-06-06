import { WatchedInfo } from './watch.info';

export type WatchListMovie = {
  id: number;
  poster: string | null;
  movieId: number;
  title: string | null;
  watched: boolean | null;
  rating: number;
  watchInfo: WatchedInfo | null;
};
