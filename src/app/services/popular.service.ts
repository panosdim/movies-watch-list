import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PopularMoviesType } from '../models/movie';

@Injectable()
export class PopularService {
  constructor(private http: HttpClient) {}

  getPopularMovies() {
    return this.http.get<PopularMoviesType>(environment.popularUrl());
  }
}
