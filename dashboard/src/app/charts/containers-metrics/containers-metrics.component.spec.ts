import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainersMetricsComponent } from './containers-metrics.component';

describe('ContainersMetricsComponent', () => {
  let component: ContainersMetricsComponent;
  let fixture: ComponentFixture<ContainersMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainersMetricsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainersMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
