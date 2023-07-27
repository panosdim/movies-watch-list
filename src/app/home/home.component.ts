import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject, OnInit } from '@angular/core';
import {
  TuiAlertService,
  TuiDialogContext,
  TuiDialogService,
  TuiNotification,
} from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { Observable, Subscription, of } from 'rxjs';
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

  imageBaseUrl = environment.imageBaseUrl;

  now: string = new Date().toISOString().slice(0, 10);

  movie: WatchListMovie | undefined;

  constructor(
    private clipboard: Clipboard,
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

  copyMovieTitle(movieTitle: string | null) {
    movieTitle && this.clipboard.copy(movieTitle);
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
