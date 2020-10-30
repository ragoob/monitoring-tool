import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEngineComponent } from './new-engine.component';

describe('NewEngineComponent', () => {
  let component: NewEngineComponent;
  let fixture: ComponentFixture<NewEngineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEngineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
