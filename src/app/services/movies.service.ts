import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TuiAlertService } from '@taiga-ui/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MovieType } from '../models/movie';
import { WatchListMovie } from '../models/watchlist';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  constructor(
    private http: HttpClient,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {}

  getMovies(): Observable<WatchListMovie[]> {
    return this.http.get<WatchListMovie[]>(environment.moviesUrl()).pipe(
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
        overview: movie.overview,
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
      .delete<void>(environment.moviesUrl() + `/${movie.id}`)
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
}
