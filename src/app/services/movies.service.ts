import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TuiAlertService } from '@taiga-ui/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  retry,
  tap,
  timer,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { MovieType } from '../models/movie';
import { WatchListMovie } from '../models/watchlist';

@Injectable()
export class MoviesService {
  private watchlistSubject = new BehaviorSubject<WatchListMovie[]>([]);

  constructor(
    private http: HttpClient,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {
    this.loadWatchlist();
  }

  getWatchlist(): Observable<WatchListMovie[]> {
    return this.watchlistSubject.asObservable();
  }

  addToWatchList(movie: any): Observable<any> {
    return this.addToWatchListAPI(movie).pipe(
      tap((result) => {
        // Add the new movie to the current list immediately for instant feedback
        const currentList = this.watchlistSubject.value;

        // Create the new movie object in the format expected by the UI
        const newMovie: WatchListMovie = {
          id: result.id,
          movieId: result.movieId,
          title: result.title,
          poster: result.poster,
          watched: result.watched || false,
          rating: result.rating || 0,
          watchInfo: result.watchInfo || null,
          userScore: result.userScore || null,
        };

        const updatedList = [...currentList, newMovie];
        this.watchlistSubject.next(updatedList);

        // Then refresh from the server after a small delay to ensure consistency
        timer(1000).subscribe(() => {
          this.loadWatchlist();
        });
      })
    );
  }

  deleteMovie(movie: WatchListMovie): Observable<any> {
    return this.deleteMovieAPI(movie).pipe(
      tap(() => {
        // Remove the movie from current list immediately
        const currentList = this.watchlistSubject.value;
        const updatedList = currentList.filter((m) => m.id !== movie.id);
        this.watchlistSubject.next(updatedList);

        // Then refresh from the server after a small delay
        timer(500).subscribe(() => {
          this.loadWatchlist();
        });
      })
    );
  }

  markMovieAsWatched(movie: WatchListMovie): Observable<any> {
    return this.markMovieAsWatchedAPI(movie).pipe(
      tap(() => {
        // Remove the movie from the watchlist immediately (since it's now watched)
        const currentList = this.watchlistSubject.value;
        const updatedList = currentList.filter((m) => m.id !== movie.id);
        this.watchlistSubject.next(updatedList);

        // Then refresh from the server after a small delay to ensure consistency
        timer(500).subscribe(() => {
          this.loadWatchlist();
        });
      })
    );
  }

  addToWatchListAPI(movie: MovieType): Observable<WatchListMovie> {
    return this.http
      .post<WatchListMovie>(environment.moviesUrl(), {
        title: movie.title,
        movieId: movie.id,
        poster: movie.poster_path,
      })
      .pipe(
        catchError((err) => {
          console.error('Error adding movie to watchlist:', err);
          this.alertService
            .open(`Error occurred while adding movie to watch list`, {
              label: `Error in adding`,
              appearance: 'error',
            })
            .subscribe();
          throw err;
        })
      );
  }

  deleteMovieAPI(movie: WatchListMovie): Observable<void> {
    return this.http
      .delete<void>(environment.moviesUrl() + `/${movie.id}`)
      .pipe(
        catchError((err) => {
          console.error('Error deleting movie:', err);
          this.alertService
            .open(`Error occurred while removing movie`, {
              label: `Error in removing`,
              appearance: 'error',
            })
            .subscribe();
          throw err;
        })
      );
  }

  markMovieAsWatchedAPI(movie: WatchListMovie): Observable<void> {
    return this.http
      .post<void>(environment.moviesUrl() + `/watched/${movie.id}`, {})
      .pipe(
        catchError((err) => {
          console.error('Error marking movie as watched:', err);
          this.alertService
            .open(`Error occurred while mark movie as watched`, {
              label: `Error in update movie`,
              appearance: 'error',
            })
            .subscribe();
          throw err;
        })
      );
  }

  getWatchedMovies(): Observable<WatchListMovie[]> {
    return this.http.get<WatchListMovie[]>(environment.watchedMoviesUrl()).pipe(
      catchError((_err) => {
        this.alertService
          .open(`Error occurred while retrieving movies list`, {
            label: `Error in movies list`,
            appearance: 'error',
          })
          .subscribe();
        return of([]);
      })
    );
  }

  rateMovie(movie: WatchListMovie, rating: number): Observable<void> {
    return this.http
      .post<void>(environment.moviesUrl() + `/rate/${movie.id}`, {
        rating: rating,
      })
      .pipe(
        catchError((_err) => {
          this.alertService
            .open(`Error occurred while rating movie`, {
              label: `Error in rating movie`,
              appearance: 'error',
            })
            .subscribe();
          return of();
        })
      );
  }

  getMoviesSuggestions(numMovies: number): Observable<MovieType[]> {
    return this.http
      .get<MovieType[]>(
        environment.suggestionUrl() + `?numOfMovies=${numMovies}`
      )
      .pipe(
        retry({
          count: 4,
          delay: (error, retryCount) => {
            if (error.status !== 503) {
              throw error;
            }
            console.warn(`Retry attempt #${retryCount}`);
            return timer(5000 * retryCount);
          },
        }),
        catchError((err) => {
          console.log(err);
          this.alertService
            .open(`Error occurred while retrieving suggested movies`, {
              label: `Error in movies suggest list`,
              appearance: 'error',
            })
            .subscribe();
          return of([]);
        })
      );
  }

  private loadWatchlist(): void {
    this.http
      .get<WatchListMovie[]>(environment.watchlistUrl())
      .pipe(
        catchError((err) => {
          console.error('Error loading watchlist:', err);
          this.alertService
            .open(`Error occurred while retrieving movies watch list`, {
              label: `Error in movies watch list`,
              appearance: 'error',
            })
            .subscribe();
          return of([]);
        })
      )
      .subscribe((watchlist) => {
        this.watchlistSubject.next(watchlist);
      });
  }
}
