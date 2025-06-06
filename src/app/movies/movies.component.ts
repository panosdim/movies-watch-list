import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TuiLoader } from '@taiga-ui/core';
import { map, Observable } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { WatchListMovie } from '../models/watchlist';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { MoviesService } from '../services/movies.service';

@Component({
  selector: 'app-movies',
  imports: [
    AsyncPipe,
    TuiLoader,
    MovieCardComponent,
    HeaderComponent,
    NgForOf,
    NgIf,
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.less',
})
export class MoviesComponent implements OnInit {
  watched$!: Observable<WatchListMovie[]>;

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.fetchMovies();
  }

  fetchMovies() {
    this.watched$ = this.moviesService.getWatchedMovies().pipe(
      map((res) =>
        res
          .filter((movie: WatchListMovie) => movie.watched)
          .sort((a, b) => {
            // First, separate movies with rating 0
            if (a.rating === 0 && b.rating !== 0) return -1;
            if (a.rating !== 0 && b.rating === 0) return 1;
            return 0;
          })
      )
    );
  }
}
