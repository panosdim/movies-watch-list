import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  TuiAlertService,
  TuiAppearance,
  TuiButton,
  TuiDialogContext,
  TuiDialogService,
} from '@taiga-ui/core';
import {
  TuiChip,
  TuiProgressBar,
  TuiProgressLabel,
  TuiRating,
} from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';
import { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WatchListMovie } from '../models/watchlist';
import { MoviesService } from '../services/movies.service';

@Component({
  selector: 'app-movie-card',
  imports: [
    TuiButton,
    TuiCardLarge,
    TuiAppearance,
    TuiRating,
    FormsModule,
    TuiChip,
    TuiProgressLabel,
    TuiProgressBar,
  ],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.less',
})
export class MovieCardComponent implements OnInit {
  @Input({ required: true }) movie!: WatchListMovie;
  @Output() refetchWatchlist = new EventEmitter();
  imageBaseUrl = environment.imageBaseUrl;
  deleteDialog!: Subscription;
  protected rating!: number;
  protected readonly Math = Math;

  constructor(
    private moviesService: MoviesService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
  ) {}

  ngOnInit() {
    this.rating = this.movie.rating;
  }

  markMovieAsWatched(): void {
    this.moviesService.markMovieAsWatched(this.movie).subscribe(() => {
      this.alertService
        .open(`Movie marked as watched`, {
          label: this.movie.title,
          appearance: 'success',
        })
        .subscribe();

      // Emit refetch after the service has completed its operations
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
      this.moviesService.deleteMovie(this.movie).subscribe(() => {
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
