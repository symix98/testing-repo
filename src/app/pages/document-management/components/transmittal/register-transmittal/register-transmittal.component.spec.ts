import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterTransmittalComponent } from './register-transmittal.component';

describe('RegisterTransmittalComponent', () => {
  let component: RegisterTransmittalComponent;
  let fixture: ComponentFixture<RegisterTransmittalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterTransmittalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterTransmittalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
