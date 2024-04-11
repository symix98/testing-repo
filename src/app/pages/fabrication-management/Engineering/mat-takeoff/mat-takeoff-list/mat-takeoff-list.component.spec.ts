import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTakeoffListComponent } from './mat-takeoff-list.component';

describe('MatTakeoffListComponent', () => {
  let component: MatTakeoffListComponent;
  let fixture: ComponentFixture<MatTakeoffListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatTakeoffListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatTakeoffListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
