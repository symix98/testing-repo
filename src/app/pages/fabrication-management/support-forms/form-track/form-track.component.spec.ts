import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTrackComponent } from './form-track.component';

describe('FormTrackComponent', () => {
  let component: FormTrackComponent;
  let fixture: ComponentFixture<FormTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormTrackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
