import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesTypeComponent } from './files-type.component';

describe('FilesTypeComponent', () => {
  let component: FilesTypeComponent;
  let fixture: ComponentFixture<FilesTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilesTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
