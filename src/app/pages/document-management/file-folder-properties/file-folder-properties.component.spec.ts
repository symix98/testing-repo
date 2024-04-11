import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileFolderPropertiesComponent } from './file-folder-properties.component';

describe('FileFolderPropertiesComponent', () => {
  let component: FileFolderPropertiesComponent;
  let fixture: ComponentFixture<FileFolderPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileFolderPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileFolderPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
