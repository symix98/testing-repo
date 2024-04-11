import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsfFormComponent } from './rsf-form.component';

describe('RsfFormComponent', () => {
  let component: RsfFormComponent;
  let fixture: ComponentFixture<RsfFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsfFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RsfFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
