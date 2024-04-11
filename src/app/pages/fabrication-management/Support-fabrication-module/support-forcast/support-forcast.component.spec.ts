import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportForcastComponent } from './support-forcast.component';

describe('SupportForcastComponent', () => {
  let component: SupportForcastComponent;
  let fixture: ComponentFixture<SupportForcastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportForcastComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportForcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
