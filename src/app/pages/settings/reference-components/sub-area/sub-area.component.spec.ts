import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAreaComponent } from './sub-area.component';

describe('SubAreaComponent', () => {
  let component: SubAreaComponent;
  let fixture: ComponentFixture<SubAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
