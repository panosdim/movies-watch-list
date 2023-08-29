import { Component, Inject } from '@angular/core';
import { TuiNightThemeService } from '@taiga-ui/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'movies-watch-list';

  constructor(
    @Inject(TuiNightThemeService) readonly night$: Observable<boolean>
  ) {}
}
