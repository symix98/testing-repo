import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTakeoffComponent } from './mat-takeoff.component';

describe('MatTakeoffComponent', () => {
  let component: MatTakeoffComponent;
  let fixture: ComponentFixture<MatTakeoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatTakeoffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatTakeoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
