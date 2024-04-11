import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUserImportComponent } from './app-user-import.component';

describe('AppUserImportComponent', () => {
  let component: AppUserImportComponent;
  let fixture: ComponentFixture<AppUserImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppUserImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppUserImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
