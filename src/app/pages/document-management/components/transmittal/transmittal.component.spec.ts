import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransmittalComponent } from './transmittal.component';

describe('TransmittalComponent', () => {
  let component: TransmittalComponent;
  let fixture: ComponentFixture<TransmittalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransmittalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransmittalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
