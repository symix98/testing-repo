import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTakeoffFormsComponent } from './mat-takeoff-forms.component';

describe('MatTakeoffFormsComponent', () => {
  let component: MatTakeoffFormsComponent;
  let fixture: ComponentFixture<MatTakeoffFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatTakeoffFormsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatTakeoffFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
