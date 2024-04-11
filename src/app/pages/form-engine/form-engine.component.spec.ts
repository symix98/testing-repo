import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEngineComponent } from './form-engine.component';

describe('FormEngineComponent', () => {
  let component: FormEngineComponent;
  let fixture: ComponentFixture<FormEngineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormEngineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
