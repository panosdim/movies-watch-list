import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TuiAlertService } from '@taiga-ui/core';
import { Observable, catchError, of, retry, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MovieType } from '../models/movie';
import { WatchListMovie } from '../models/watchlist';

@Injectable()
export class MoviesService {
  constructor(
    private http: HttpClient,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {}

  getWatchlist(): Observable<WatchListMovie[]> {
    return this.http.get<WatchListMovie[]>(environment.watchlistUrl()).pipe(
      catchError((_err) => {
        this.alertService
          .open(`Error occurred while retrieving movies watch list`, {
            label: `Error in movies watch list`,
            appearance: 'error',
          })
          .subscribe();
        return of();
      })
    );
  }

  addToWatchList(movie: MovieType): Observable<WatchListMovie> {
    return this.http
      .post<WatchListMovie>(environment.moviesUrl(), {
        title: movie.title,
        movieId: movie.id,
        poster: movie.poster_path,
      })
      .pipe(
        catchError((_err) => {
          this.alertService
            .open(`Error occurred while adding movie to watch list`, {
              label: `Error in adding`,
              appearance: 'error',
            })
            .subscribe();
          return of();
        })
      );
  }

  deleteMovie(movie: WatchListMovie): Observable<void> {
    return this.http
      .delete<void>(environment.moviesUrl() + `/${movie.id}`)
      .pipe(
        catchError((_err) => {
          this.alertService
            .open(`Error occurred while removing movie`, {
              label: `Error in removing`,
              appearance: 'error',
            })
            .subscribe();
          return of();
        })
      );
  }

  markMovieAsWatched(movie: WatchListMovie): Observable<void> {
    return this.http
      .post<void>(environment.moviesUrl() + `/watched/${movie.id}`, {})
      .pipe(
        catchError((_err) => {
          this.alertService
            .open(`Error occurred while mark movie as watched`, {
              label: `Error in update movie`,
              appearance: 'error',
            })
            .subscribe();
          return of();
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
        return of();
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
        environment.moviesUrl() + `/suggestion?numMovies=${numMovies}`
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
}
