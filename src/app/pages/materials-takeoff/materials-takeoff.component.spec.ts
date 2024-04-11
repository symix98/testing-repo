import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsTakeoffComponent } from './materials-takeoff.component';

describe('MaterialsTakeoffComponent', () => {
  let component: MaterialsTakeoffComponent;
  let fixture: ComponentFixture<MaterialsTakeoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialsTakeoffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsTakeoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
