import { TestBed } from '@angular/core/testing';

import { DockerEngineService } from './docker-engine.service';

describe('DockerEngineService', () => {
  let service: DockerEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DockerEngineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
