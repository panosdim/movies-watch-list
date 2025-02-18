import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { TuiAlertService, TuiLoader } from '@taiga-ui/core';
import { Observable, of } from 'rxjs';
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
        MoviesSuggestionsComponent,
        HeaderComponent,
        TuiLoader,
    ]
})
export class HomeComponent implements OnInit {
  released$!: Observable<WatchListMovie[]>;
  coming$!: Observable<WatchListMovie[]>;
  unknown$!: Observable<WatchListMovie[]>;
  now: string = new Date().toISOString().slice(0, 10);

  constructor(
    private moviesService: MoviesService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {}

  ngOnInit(): void {
    this.moviesService.updateReleaseDates().subscribe(() => {
      this.alertService
        .open(`DVD release date have been updated`, {
          label: `Release dates update`,
          appearance: 'info',
        })
        .subscribe();
      this.fetchWatchList();
    });
  }

  fetchWatchList() {
    this.moviesService.getWatchlist().subscribe((res) => {
      const temp = res.filter(
        (movie: WatchListMovie) => movie.release_date !== null
      );

      this.released$ = of(
        temp
          .filter((movie: WatchListMovie) => movie.release_date <= this.now)
          .sort((a, b) => a.release_date.localeCompare(b.release_date))
      );

      this.coming$ = of(
        temp
          .filter((movie: WatchListMovie) => movie.release_date > this.now)
          .sort((a, b) => a.release_date.localeCompare(b.release_date))
      );

      this.unknown$ = of(
        res.filter((movie: WatchListMovie) => movie.release_date === null)
      );
    });
  }
}
