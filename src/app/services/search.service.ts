import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TuiAlertService } from '@taiga-ui/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MovieType, PopularMoviesType } from '../models/movie';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  public searchTerm = new BehaviorSubject<string>('');

  constructor(
    private http: HttpClient,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {}

  public setSearchTerm(term: string) {
    this.searchTerm.next(term);
  }

  public getSearchTerm(): Observable<string> {
    return this.searchTerm.asObservable();
  }

  autocompleteMovies(term: string) {
    return this.http.post<Array<string[]>>(environment.autocompleteUrl(), {
      term: term,
    });
  }

  searchMovies(term: string): Observable<MovieType[]> {
    return this.http
      .post<PopularMoviesType>(environment.searchUrl(), {
        term: term,
      })
      .pipe(
        map((res) => {
          return res.results;
        })
      )
      .pipe(
        catchError((_err) => {
          this.alertService
            .open(`Error occurred while searching for movies`, {
              label: `Error in searching`,
              appearance: 'error',
            })
            .subscribe();
          return of();
        })
      );
  }
}
