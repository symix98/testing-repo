import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupMtoDetailsComponent } from './popup-mto-details.component';

describe('PopupMtoDetailsComponent', () => {
  let component: PopupMtoDetailsComponent;
  let fixture: ComponentFixture<PopupMtoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupMtoDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupMtoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
