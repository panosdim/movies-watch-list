import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {TuiLoader} from '@taiga-ui/core';
import {Observable} from 'rxjs';
import {HeaderComponent} from '../header/header.component';
import {WatchListMovie} from '../models/watchlist';
import {MovieCardComponent} from '../movie-card/movie-card.component';
import {MoviesSuggestionsComponent} from '../movies-suggestions/movies-suggestions.component';
import {MoviesService} from '../services/movies.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  imports: [
    CommonModule,
    MovieCardComponent,
    MoviesSuggestionsComponent,
    HeaderComponent,
    TuiLoader,
  ]
})
export class HomeComponent implements OnInit {
  watchlist$!: Observable<WatchListMovie[]>;

  constructor(
    private moviesService: MoviesService,
  ) {
  }

  ngOnInit(): void {
    this.fetchWatchList();
  }

  fetchWatchList() {
    this.watchlist$ = this.moviesService.getWatchlist();
  }
}
