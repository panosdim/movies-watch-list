import { TestBed } from '@angular/core/testing';

import { AuthInteceptorService } from './auth-inteceptor.service';

describe('AuthInteceptorService', () => {
  let service: AuthInteceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthInteceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
