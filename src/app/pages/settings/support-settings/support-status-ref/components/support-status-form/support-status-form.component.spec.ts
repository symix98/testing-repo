import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportStatusFormComponent } from './support-status-form.component';

describe('SupportStatusFormComponent', () => {
  let component: SupportStatusFormComponent;
  let fixture: ComponentFixture<SupportStatusFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportStatusFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportStatusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
