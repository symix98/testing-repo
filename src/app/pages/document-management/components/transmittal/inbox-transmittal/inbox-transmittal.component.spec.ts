import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxTransmittalComponent } from './inbox-transmittal.component';

describe('TransmittalAcknowledgeResponseComponent', () => {
  let component: InboxTransmittalComponent;
  let fixture: ComponentFixture<InboxTransmittalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InboxTransmittalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxTransmittalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
