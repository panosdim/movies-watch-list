import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MovieType } from '../models/movie';
import { WatchListMovie } from '../models/watchlist';
import { MoviesService } from '../services/movies.service';
import { SearchService } from '../services/search.service';

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less'],
})
export class SearchComponent implements OnInit {
  searchResults$!: Observable<MovieType[]>;
  inSearch: boolean = false;
  imageBaseUrl = environment.imageBaseUrl + 'w92';
  watchList: WatchListMovie[] | undefined;

  constructor(
    private router: Router,
    private searchService: SearchService,
    private moviesService: MoviesService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {}

  ngOnInit(): void {
    this.searchService.getSearchTerm().subscribe((term) => {
      if (term) {
        this.inSearch = true;
        this.searchResults$ = this.searchService.searchMovies(term);
      } else {
        this.inSearch = false;
        this.searchResults$ = of([]);
      }
    });

    this.moviesService.getMovies().subscribe((res) => {
      this.watchList = res;
    });
  }

  backToMovies() {
    this.searchService.setSearchTerm('');
    this.router.navigateByUrl('/home');
  }

  isMovieAlreadyInWatchList(movieId: number): boolean {
    return (
      this.watchList != undefined &&
      this.watchList.some((movie: WatchListMovie) => movie.movie_id === movieId)
    );
  }

  addMovieToWatchList(movie: MovieType) {
    this.moviesService.addToWatchList(movie).subscribe(() => {
      this.alertService
        .open(`Movie added to watch list`, {
          label: movie.title,
          status: TuiNotification.Success,
        })
        .subscribe();
      this.backToMovies();
    });
  }
}
