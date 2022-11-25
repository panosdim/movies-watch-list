import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { switchMap } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { MoviesService } from '../services/movies.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly search = new FormControl(this.moviesService.searchTerm);

  readonly movies$ = this.search.valueChanges.pipe(
    switchMap((value) => {
      if (value && value.length > 2) {
        return this.moviesService.autocompleteMovies(value);
      }

      return [];
    })
  );

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private moviesService: MoviesService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  logout() {
    this.authService.logout();
    this.alertService
      .open(`You have successfully logged out`, {
        label: `Logout`,
        status: TuiNotification.Info,
      })
      .subscribe();
    this.router.navigateByUrl('/login');
  }

  onSelected(movie: string): void {
    this.moviesService.searchTerm = movie;
    this.router.navigateByUrl('/search');
  }

  onKeypressEvent(event: any) {
    if (event.which === 13 || event.keyCode === 13) {
      this.moviesService.searchTerm = event.target.value;
      this.router.navigateByUrl('/search');
    }
  }
}
