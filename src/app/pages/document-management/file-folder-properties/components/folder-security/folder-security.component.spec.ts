import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderSecurityComponent } from './folder-security.component';

describe('FolderSecurityComponent', () => {
  let component: FolderSecurityComponent;
  let fixture: ComponentFixture<FolderSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FolderSecurityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
