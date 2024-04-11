import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransmittalNumbringComponent } from './transmittal-numbring.component';

describe('TransmittalNumbringComponent', () => {
  let component: TransmittalNumbringComponent;
  let fixture: ComponentFixture<TransmittalNumbringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransmittalNumbringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransmittalNumbringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
