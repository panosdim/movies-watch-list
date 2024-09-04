import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiAlertService } from '@taiga-ui/core';
import { switchMap } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly search = new FormControl(this.searchService.searchTerm.getValue());
  showDropdown: boolean = true;

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
