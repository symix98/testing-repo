import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceComponentsComponent } from './reference-components.component';

describe('ReferenceComponentsComponent', () => {
  let component: ReferenceComponentsComponent;
  let fixture: ComponentFixture<ReferenceComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferenceComponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
