import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsSubTypeComponent } from './documents-sub-type.component';

describe('DocumentsSubTypeComponent', () => {
  let component: DocumentsSubTypeComponent;
  let fixture: ComponentFixture<DocumentsSubTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentsSubTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsSubTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
