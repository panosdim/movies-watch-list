import {Clipboard} from '@angular/cdk/clipboard';
import {Component, EventEmitter, Inject, Input, OnInit, Output,} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TuiAlertService, TuiAppearance, TuiButton, TuiDialogContext, TuiDialogService, TuiIcon,} from '@taiga-ui/core';
import {TuiRating} from '@taiga-ui/kit';
import {TuiCardLarge} from '@taiga-ui/layout';
import {PolymorpheusContent} from '@taiga-ui/polymorpheus';
import {Subscription} from 'rxjs';
import {environment} from 'src/environments/environment';
import {WatchListMovie} from '../models/watchlist';
import {MoviesService} from '../services/movies.service';

@Component({
  selector: 'app-movie-card',
  imports: [
    TuiIcon,
    TuiButton,
    TuiCardLarge,
    TuiAppearance,
    TuiRating,
    FormsModule,
  ],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.less'
})
export class MovieCardComponent implements OnInit {
  @Input({required: true}) movie!: WatchListMovie;
  @Output() refetchWatchlist = new EventEmitter();
  imageBaseUrl = environment.imageBaseUrl;
  deleteDialog!: Subscription;
  chipAppearance: string = 'primary';
  protected rating!: number;

  constructor(
    private clipboard: Clipboard,
    private moviesService: MoviesService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService
  ) {
  }

  ngOnInit() {
    this.rating = this.movie.rating;
  }

  copyMovieTitle(movieTitle: string | null) {
    movieTitle && this.clipboard.copy(movieTitle);
  }

  markMovieAsDownloaded(): void {
    this.moviesService.markMovieAsDownloaded(this.movie).subscribe(() => {
      this.alertService
        .open(`Movie marked as downloaded`, {
          label: this.movie.title,
          appearance: 'success',
        })
        .subscribe();

      this.refetchWatchlist.emit();
    });
  }

  markMovieAsWatched(): void {
    this.moviesService.markMovieAsWatched(this.movie).subscribe(() => {
      this.alertService
        .open(`Movie marked as watched`, {
          label: this.movie.title,
          appearance: 'success',
        })
        .subscribe();

      this.refetchWatchlist.emit();
    });
  }

  onRatingChange(newRating: number) {
    this.rating = newRating;
    this.rateMovie();
  }

  rateMovie(): void {
    this.moviesService.rateMovie(this.movie, this.rating).subscribe(() => {
      this.alertService
        .open(`Movie rated successfully`, {
          label: this.movie.title,
          appearance: 'success',
        })
        .subscribe();
    });
  }

  showDeleteDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.deleteDialog = this.dialogService.open(content).subscribe();
  }

  deleteMovie(): void {
    this.deleteDialog.unsubscribe();
    if (this.movie) {
      const movieTitle = this.movie.title;
      this.moviesService.removeFromWatchList(this.movie).subscribe(() => {
        this.alertService
          .open(`Movie removed from watch list`, {
            label: movieTitle,
            appearance: 'success',
          })
          .subscribe();

        this.refetchWatchlist.emit();
      });
    }
  }
}
