import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsfAssignComponent } from './rsf-assign.component';

describe('RsfAssignComponent', () => {
  let component: RsfAssignComponent;
  let fixture: ComponentFixture<RsfAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsfAssignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RsfAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
