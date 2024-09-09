import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TuiTabBar } from '@taiga-ui/addon-mobile';
import { TuiLet } from '@taiga-ui/cdk';
import {
  TuiAlertService,
  TuiButton,
  TuiDataList,
  TuiFallbackSrcPipe,
  TuiInitialsPipe,
  TuiSurface,
} from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { TuiInputModule } from '@taiga-ui/legacy';
import { switchMap } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    TuiAvatar,
    TuiInputModule,
    TuiFallbackSrcPipe,
    TuiInitialsPipe,
    AsyncPipe,
    ...TuiDataList,
    CommonModule,
    ReactiveFormsModule,
    TuiButton,
    TuiLet,
    TuiCardLarge,
    TuiSurface,
    TuiHeader,
    TuiTabBar,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly search = new FormControl(this.searchService.searchTerm.getValue());
  showDropdown: boolean = true;
  // Define routes as an object with key-value pairs
  protected readonly routePaths = {
    home: '/home',
    movies: '/movies',
    search: '/search',
  };

  readonly movies$ = this.search.valueChanges.pipe(
    switchMap((value) => {
      if (value && value.length > 2) {
        this.showDropdown = true;
        return this.searchService.autocompleteMovies(value);
      }

      return [];
    })
  );

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private searchService: SearchService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {}

  logout() {
    this.authService.logout();
    this.alertService
      .open(`You have successfully logged out`, {
        label: `Logout`,
        appearance: 'info',
      })
      .subscribe();
    this.router.navigateByUrl('/login');
  }

  allMovies() {
    this.router.navigateByUrl('/movies');
  }

  onSelected(movie: string): void {
    this.showDropdown = false;
    this.searchService.setSearchTerm(movie);
    this.router.navigateByUrl('/search');
  }

  onKeypressEvent(event: any) {
    if (event.which === 13 || event.keyCode === 13) {
      this.showDropdown = false;
      this.searchService.setSearchTerm(event.target.value);
      this.router.navigateByUrl('/search');
    }
  }
}
