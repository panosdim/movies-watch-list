export type WatchListMovie = {
  id: number;
  image: string | null;
  movie_id: number;
  overview: string;
  release_date: string;
  title: string | null;
  name: string | null;
  downloaded: boolean | null;
  watched: boolean | null;
  rating: number | null;
};
