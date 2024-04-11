import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenFormComponent } from './gen-form.component';

describe('GenFormComponent', () => {
  let component: GenFormComponent;
  let fixture: ComponentFixture<GenFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
