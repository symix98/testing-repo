import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportsDetailsFormComponent } from './supports-details-form.component';

describe('SupportsDetailsFormComponent', () => {
  let component: SupportsDetailsFormComponent;
  let fixture: ComponentFixture<SupportsDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportsDetailsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportsDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
