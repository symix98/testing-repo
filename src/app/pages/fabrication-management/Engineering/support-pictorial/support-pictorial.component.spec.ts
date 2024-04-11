import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportPictorialComponent } from './support-pictorial.component';

describe('SupportPictorialComponent', () => {
  let component: SupportPictorialComponent;
  let fixture: ComponentFixture<SupportPictorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportPictorialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportPictorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
