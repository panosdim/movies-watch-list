import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesSuggestionsComponent } from './movies-suggestions.component';

describe('MoviesSuggestionsComponent', () => {
  let component: MoviesSuggestionsComponent;
  let fixture: ComponentFixture<MoviesSuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesSuggestionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoviesSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
