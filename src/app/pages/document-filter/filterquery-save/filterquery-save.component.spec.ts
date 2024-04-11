import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterquerySaveComponent } from './filterquery-save.component';

describe('FilterquerySaveComponent', () => {
  let component: FilterquerySaveComponent;
  let fixture: ComponentFixture<FilterquerySaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterquerySaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterquerySaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
