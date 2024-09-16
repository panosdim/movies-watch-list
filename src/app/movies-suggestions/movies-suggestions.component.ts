import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import {
  TuiAlertService,
  TuiButton,
  TuiLoader,
  TuiSurface,
  TuiTitle,
} from '@taiga-ui/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MovieType } from '../models/movie';
import { WatchListMovie } from '../models/watchlist';
import { MoviesService } from '../services/movies.service';

@Component({
  selector: 'app-movies-suggestions',
  standalone: true,
  imports: [
    TuiCardLarge,
    TuiHeader,
    TuiSurface,
    TuiTitle,
    TuiLoader,
    AsyncPipe,
    NgForOf,
    NgIf,
    TuiButton,
  ],
  templateUrl: './movies-suggestions.component.html',
  styleUrl: './movies-suggestions.component.less',
})
export class MoviesSuggestionsComponent {
  @Output() refetchWatchlist = new EventEmitter();
  moviesSuggestions$!: Observable<MovieType[]>;
  imageBaseUrl = environment.imageBaseUrl;
  watchList: WatchListMovie[] | undefined;
  movies: WatchListMovie[] | undefined;

  ngOnInit(): void {
    this.fetchData();
  }

  constructor(
    private moviesService: MoviesService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {}

  fetchData() {
    this.moviesService.getMoviesSuggestions(20).subscribe((res) => {
      this.moviesSuggestions$ = of(
        res
          .filter(
            (suggestion) =>
              !this.isMovieAlreadyInList(suggestion.id, this.watchList) &&
              !this.isMovieAlreadyInList(suggestion.id, this.movies)
          )
          .slice(0, 8)
      );
    });

    this.moviesService.getWatchlist().subscribe((res) => {
      this.watchList = res;
    });

    this.moviesService.getMovies().subscribe((res) => {
      this.movies = res;
    });
  }

  // Helper function to check if a movie ID exists in a list
  isMovieAlreadyInList(
    movieId: number,
    list: WatchListMovie[] | undefined
  ): boolean {
    return list?.some((movie) => movie.movie_id === movieId) ?? false;
  }

  isMovieAlreadyInWatchList(movieId: number): boolean {
    return (
      this.watchList != undefined &&
      this.watchList.some(
        (movie: WatchListMovie) => movie.movie_id === movieId
      ) &&
      this.movies != undefined &&
      this.movies.some((movie: WatchListMovie) => movie.movie_id === movieId)
    );
  }

  addMovieToWatchList(movie: MovieType) {
    this.moviesService.addToWatchList(movie).subscribe(() => {
      this.alertService
        .open(`Movie added to watch list`, {
          label: movie.title,
          appearance: 'success',
        })
        .subscribe();

      this.moviesSuggestions$ = of();
      this.refetchWatchlist.emit();
      this.fetchData();
    });
  }
}
