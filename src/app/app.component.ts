import { Component, inject } from '@angular/core';
import { TUI_DARK_MODE } from '@taiga-ui/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'movies-watch-list';
  protected readonly darkMode = inject(TUI_DARK_MODE);
}
