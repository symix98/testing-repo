import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricateComponent } from './fabricate.component';

describe('FabricateComponent', () => {
  let component: FabricateComponent;
  let fixture: ComponentFixture<FabricateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FabricateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FabricateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
