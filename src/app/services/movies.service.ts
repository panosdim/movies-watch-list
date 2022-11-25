import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  constructor(private http: HttpClient) {}

  searchTerm: string | undefined;

  autocompleteMovies(term: string) {
    return this.http.post<Array<string[]>>(environment.autocompleteUrl(), {
      term: term,
    });
  }
}
