import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUserAddComponent } from './app-user-add.component';

describe('AppUserAddComponent', () => {
  let component: AppUserAddComponent;
  let fixture: ComponentFixture<AppUserAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppUserAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppUserAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
