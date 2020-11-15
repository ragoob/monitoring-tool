import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerMetricsCpuComponent } from './container-metrics-cpu.component';

describe('ContainerMetricsCpuComponent', () => {
  let component: ContainerMetricsCpuComponent;
  let fixture: ComponentFixture<ContainerMetricsCpuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerMetricsCpuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerMetricsCpuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
