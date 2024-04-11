import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetInboxComponent } from './widget-inbox.component';

describe('WidgetInboxComponent', () => {
  let component: WidgetInboxComponent;
  let fixture: ComponentFixture<WidgetInboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetInboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
