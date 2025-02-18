import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TuiLoader } from '@taiga-ui/core';
import { Observable, of } from 'rxjs';
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
    styleUrl: './movies.component.less'
})
export class MoviesComponent implements OnInit {
  downloaded$!: Observable<WatchListMovie[]>;
  watched$!: Observable<WatchListMovie[]>;

  constructor(private moviesService: MoviesService) {}
  ngOnInit(): void {
    this.fetchMovies();
  }

  fetchMovies() {
    this.moviesService.getMovies().subscribe((res) => {
      const temp = res.filter(
        (movie: WatchListMovie) => movie.release_date !== null
      );

      this.downloaded$ = of(
        temp
          .filter((movie: WatchListMovie) => movie.downloaded && !movie.watched)
          .sort((a, b) => a.release_date.localeCompare(b.release_date))
      );

      this.watched$ = of(
        temp
          .filter((movie: WatchListMovie) => movie.watched)
          .sort((a, b) => a.release_date.localeCompare(b.release_date))
      );
    });
  }
}
