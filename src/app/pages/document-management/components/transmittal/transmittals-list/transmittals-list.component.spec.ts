import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransmittalsListComponent } from './transmittals-list.component';

describe('TransmittalsListComponent', () => {
  let component: TransmittalsListComponent;
  let fixture: ComponentFixture<TransmittalsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransmittalsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransmittalsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
