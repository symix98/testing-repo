import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialTakeoffFormComponent } from './material-takeoff-form.component';

describe('MaterialTakeoffFormComponent', () => {
  let component: MaterialTakeoffFormComponent;
  let fixture: ComponentFixture<MaterialTakeoffFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialTakeoffFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialTakeoffFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
