import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadDocumentsDialogComponent } from './download-documents-dialog.component';

describe('DownloadDocumentsDialogComponent', () => {
  let component: DownloadDocumentsDialogComponent;
  let fixture: ComponentFixture<DownloadDocumentsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadDocumentsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadDocumentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
