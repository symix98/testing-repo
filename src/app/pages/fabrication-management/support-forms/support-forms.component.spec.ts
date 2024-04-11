import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportFormsComponent } from './support-forms.component';

describe('SupportFormsComponent', () => {
  let component: SupportFormsComponent;
  let fixture: ComponentFixture<SupportFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportFormsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
