import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabTrackerComponent } from './fab-tracker.component';

describe('FabTrackerComponent', () => {
  let component: FabTrackerComponent;
  let fixture: ComponentFixture<FabTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FabTrackerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FabTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
