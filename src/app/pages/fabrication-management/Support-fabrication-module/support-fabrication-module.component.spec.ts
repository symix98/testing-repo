import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportFabricationModuleComponent } from './support-fabrication-module.component';

describe('SupportFabricationModuleComponent', () => {
  let component: SupportFabricationModuleComponent;
  let fixture: ComponentFixture<SupportFabricationModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportFabricationModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportFabricationModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
