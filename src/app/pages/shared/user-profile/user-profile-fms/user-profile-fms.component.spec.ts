import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileFmsComponent } from './user-profile-fms.component';

describe('UserProfileFmsComponent', () => {
  let component: UserProfileFmsComponent;
  let fixture: ComponentFixture<UserProfileFmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProfileFmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileFmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
