import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpuCardComponent } from './cpu-card.component';

describe('CpuCardComponent', () => {
  let component: CpuCardComponent;
  let fixture: ComponentFixture<CpuCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpuCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpuCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
