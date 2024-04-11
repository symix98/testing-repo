import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkFlowStepComponent } from './add-work-flow-step.component';

describe('AddWorkFlowStepComponent', () => {
  let component: AddWorkFlowStepComponent;
  let fixture: ComponentFixture<AddWorkFlowStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWorkFlowStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkFlowStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
