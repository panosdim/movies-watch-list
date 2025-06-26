import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TuiLoader } from '@taiga-ui/core';
import { map, Observable } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { WatchListMovie } from '../models/watchlist';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { MoviesSuggestionsComponent } from '../movies-suggestions/movies-suggestions.component';
import { MoviesService } from '../services/movies.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  imports: [
    CommonModule,
    MovieCardComponent,
    HeaderComponent,
    TuiLoader,
    MoviesSuggestionsComponent,
  ],
})
export class HomeComponent implements OnInit {
  watchlist$!: Observable<WatchListMovie[]>;

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.fetchWatchlist();
  }

  fetchWatchlist() {
    this.watchlist$ = this.moviesService.getWatchlist().pipe(
      map((movies) =>
        movies.sort((a, b) => {
          // Movies with watchInfo (not null) come first
          if (a.watchInfo !== null && b.watchInfo === null) return -1;
          if (a.watchInfo === null && b.watchInfo !== null) return 1;
          return 0;
        })
      )
    );
  }
}
