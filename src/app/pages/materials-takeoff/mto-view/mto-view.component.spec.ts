import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtoViewComponent } from './mto-view.component';

describe('MtoViewComponent', () => {
  let component: MtoViewComponent;
  let fixture: ComponentFixture<MtoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtoViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MtoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
