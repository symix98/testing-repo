import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTimelineComponent } from './form-timeline.component';

describe('FormTimelineComponent', () => {
  let component: FormTimelineComponent;
  let fixture: ComponentFixture<FormTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
