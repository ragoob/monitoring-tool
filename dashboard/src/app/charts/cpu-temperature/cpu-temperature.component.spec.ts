import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpuTemperatureComponent } from './cpu-temperature.component';

describe('CpuTemperatureComponent', () => {
  let component: CpuTemperatureComponent;
  let fixture: ComponentFixture<CpuTemperatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpuTemperatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpuTemperatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
