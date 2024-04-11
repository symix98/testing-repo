import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportStatusListComponent } from './support-status-list.component';

describe('SupportStatusListComponent', () => {
  let component: SupportStatusListComponent;
  let fixture: ComponentFixture<SupportStatusListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportStatusListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
