import { Component, Inject, OnInit } from '@angular/core';
import {
  TuiAlertService,
  TuiDialogContext,
  TuiDialogService,
  TuiNotification,
} from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { Observable, of, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WatchListMovie } from '../models/watchlist';
import { MoviesService } from '../services/movies.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
  released$!: Observable<WatchListMovie[]>;
  coming$!: Observable<WatchListMovie[]>;
  unknown$!: Observable<WatchListMovie[]>;

  deleteDialog!: Subscription;

  imageBaseUrl = environment.imageBaseUrl + 'w300';

  now: string = new Date().toISOString().slice(0, 10);

  movie: WatchListMovie | undefined;

  constructor(
    private moviesService: MoviesService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService
  ) {}

  ngOnInit(): void {
    this.moviesService.updateReleaseDates().subscribe(() => {
      this.alertService
        .open(`DVD release date have been updated`, {
          label: `Release dates update`,
          status: TuiNotification.Info,
        })
        .subscribe();
      this.fetchWatchList();
    });
  }

  private fetchWatchList() {
    this.moviesService.getMovies().subscribe((res) => {
      const temp = res.filter(
        (movie: WatchListMovie) => movie.release_date !== null
      );

      this.released$ = of(
        temp.filter((movie: WatchListMovie) => movie.release_date <= this.now)
      );

      this.coming$ = of(
        temp.filter((movie: WatchListMovie) => movie.release_date > this.now)
      );

      this.unknown$ = of(
        res.filter((movie: WatchListMovie) => movie.release_date === null)
      );
    });
  }

  showDeleteDialog(
    content: PolymorpheusContent<TuiDialogContext>,
    movie: WatchListMovie
  ): void {
    this.deleteDialog = this.dialogService.open(content).subscribe();
    this.movie = movie;
  }

  deleteMovie(): void {
    this.deleteDialog.unsubscribe();
    if (this.movie) {
      const movieTitle = this.movie.title;
      this.moviesService.removeFromWatchList(this.movie).subscribe(() => {
        this.alertService
          .open(`Movie removed from watch list`, {
            label: movieTitle,
            status: TuiNotification.Success,
          })
          .subscribe();
        this.movie = undefined;
        this.fetchWatchList();
      });
    }
  }
}
