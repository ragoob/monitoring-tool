import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiskCardComponent } from './disk-card.component';

describe('DiskCardComponent', () => {
  let component: DiskCardComponent;
  let fixture: ComponentFixture<DiskCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiskCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiskCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
