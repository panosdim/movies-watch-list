import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TUI_DARK_MODE, TuiRoot } from '@taiga-ui/core';
import { MoviesService } from './services/movies.service';
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  imports: [TuiRoot, RouterOutlet],
  providers: [MoviesService, SearchService],
})
export class AppComponent {
  title = 'movies-watch-list';
  protected readonly darkMode = inject(TUI_DARK_MODE);
}
