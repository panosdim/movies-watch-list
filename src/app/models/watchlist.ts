export type WatchListMovie = {
  id: number;
  image: string | null;
  movie_id: number;
  release_date: string;
  title: string | null;
  name: string | null;
  downloaded: boolean;
  watched: boolean;
  rating: number;
};
