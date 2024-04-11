import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsfReviseComponent } from './rsf-revise.component';

describe('RsfReviseComponent', () => {
  let component: RsfReviseComponent;
  let fixture: ComponentFixture<RsfReviseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsfReviseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RsfReviseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
