import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportStatusRefComponent } from './support-status-ref.component';

describe('SupportStatusRefComponent', () => {
  let component: SupportStatusRefComponent;
  let fixture: ComponentFixture<SupportStatusRefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportStatusRefComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportStatusRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
