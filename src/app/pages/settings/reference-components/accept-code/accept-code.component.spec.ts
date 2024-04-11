import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptCodeComponent } from './accept-code.component';

describe('AcceptCodeComponent', () => {
  let component: AcceptCodeComponent;
  let fixture: ComponentFixture<AcceptCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
