import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  TuiAlertService,
  TuiAppearance,
  TuiButton,
  TuiLoader,
} from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { finalize, Observable, of, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from '../header/header.component';
import { MovieType } from '../models/movie';
import { WatchListMovie } from '../models/watchlist';
import { MoviesService } from '../services/movies.service';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less'],
  imports: [
    CommonModule,
    TuiCardLarge,
    TuiButton,
    TuiAppearance,
    TuiLoader,
    HeaderComponent,
  ],
})
export class SearchComponent implements OnInit, OnDestroy {
  searchResults$!: Observable<MovieType[]>;
  inSearch: boolean = false;
  searchCompleted: boolean = false;
  imageBaseUrl = environment.imageBaseUrl + 'w92';
  watchList: WatchListMovie[] = [];
  movies: WatchListMovie[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private searchService: SearchService,
    private moviesService: MoviesService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {}

  ngOnInit(): void {
    // Subscribe to search term changes
    const searchSub = this.searchService.getSearchTerm().subscribe((term) => {
      if (term) {
        this.inSearch = true;
        this.searchCompleted = false;
        this.searchResults$ = this.searchService
          .searchMovies(term)
          .pipe(finalize(() => (this.searchCompleted = true)));
      } else {
        this.inSearch = false;
        this.searchResults$ = of([] as MovieType[]);
      }
    });
    this.subscriptions.push(searchSub);

    // Subscribe to watchlist changes
    const watchlistSub = this.moviesService.getWatchlist().subscribe((res) => {
      this.watchList = res;
    });
    this.subscriptions.push(watchlistSub);

    // Subscribe to watched movies
    const watchedSub = this.moviesService.getWatchedMovies().subscribe((res) => {
      this.movies = res;
    });
    this.subscriptions.push(watchedSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  backToHome() {
    this.searchService.setSearchTerm('');
    this.router.navigateByUrl('/home');
  }

  isMovieAlreadyInWatchList(movieId: number): boolean {
    return (
      this.watchList.some((movie: WatchListMovie) => movie.movieId === movieId) ||
      this.movies.some((movie: WatchListMovie) => movie.movieId === movieId)
    );
  }

  addMovieToWatchList(movie: MovieType) {
    this.moviesService.addToWatchList(movie).subscribe({
      next: (_result) => {
        this.alertService
          .open(`Movie added to watch list`, {
            label: movie.title,
            appearance: 'success',
          })
          .subscribe();
        this.backToHome();
      },
      error: (error) => {
        console.error('Error adding movie:', error);
      }
    });
  }
}
