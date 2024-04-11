import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportPictorialFormComponent } from './support-pictorial-form.component';

describe('SupportPictorialFormComponent', () => {
  let component: SupportPictorialFormComponent;
  let fixture: ComponentFixture<SupportPictorialFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportPictorialFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportPictorialFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
