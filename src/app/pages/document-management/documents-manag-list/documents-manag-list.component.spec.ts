import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsManagListComponent } from './documents-manag-list.component';

describe('DocumentsManagListComponent', () => {
  let component: DocumentsManagListComponent;
  let fixture: ComponentFixture<DocumentsManagListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentsManagListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsManagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
