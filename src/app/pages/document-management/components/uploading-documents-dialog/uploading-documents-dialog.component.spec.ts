import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadingDocumentsDialogComponent } from './uploading-documents-dialog.component';

describe('UploadingDocumentsDialogComponent', () => {
  let component: UploadingDocumentsDialogComponent;
  let fixture: ComponentFixture<UploadingDocumentsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadingDocumentsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadingDocumentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
