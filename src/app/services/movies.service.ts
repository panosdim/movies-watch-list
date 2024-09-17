import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TuiAlertService } from '@taiga-ui/core';
import { Observable, catchError, of } from 'rxjs';
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
      .post<WatchListMovie>(environment.watchlistUrl(), {
        title: movie.title,
        movie_id: movie.id,
        image: movie.poster_path,
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

  removeFromWatchList(movie: WatchListMovie): Observable<void> {
    return this.http
      .delete<void>(environment.watchlistUrl() + `/${movie.id}`)
      .pipe(
        catchError((_err) => {
          this.alertService
            .open(`Error occurred while removing movie from watch list`, {
              label: `Error in removing`,
              appearance: 'error',
            })
            .subscribe();
          return of();
        })
      );
  }

  updateReleaseDates(): Observable<void> {
    return this.http.get<void>(environment.updateReleaseDatesUrl()).pipe(
      catchError((_err) => {
        this.alertService
          .open(`Error occurred while updating release dates`, {
            label: `Error in update release dates`,
            appearance: 'error',
          })
          .subscribe();
        return of();
      })
    );
  }

  markMovieAsDownloaded(movie: WatchListMovie): Observable<void> {
    return this.http
      .post<void>(environment.moviesUrl() + `/mark/downloaded/${movie.id}`, {})
      .pipe(
        catchError((_err) => {
          this.alertService
            .open(`Error occurred while mark movie as downloaded`, {
              label: `Error in update movie`,
              appearance: 'error',
            })
            .subscribe();
          return of();
        })
      );
  }

  markMovieAsWatched(movie: WatchListMovie): Observable<void> {
    return this.http
      .post<void>(environment.moviesUrl() + `/mark/watched/${movie.id}`, {})
      .pipe(
        catchError((_err) => {
          this.alertService
            .open(`Error occurred while mark movie as downloaded`, {
              label: `Error in update movie`,
              appearance: 'error',
            })
            .subscribe();
          return of();
        })
      );
  }

  getMovies(): Observable<WatchListMovie[]> {
    return this.http.get<WatchListMovie[]>(environment.moviesUrl()).pipe(
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
        catchError((err) => {
          console.log(err);
          this.alertService
            .open(`Error occurred while retrieving suggested movies`, {
              label: `Error in movies suggest list`,
              appearance: 'error',
            })
            .subscribe();
          return of();
        })
      );
  }
}
