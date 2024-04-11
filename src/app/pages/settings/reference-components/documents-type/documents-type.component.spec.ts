import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsTypeComponent } from './documents-type.component';

describe('DocumentsTypeComponent', () => {
  let component: DocumentsTypeComponent;
  let fixture: ComponentFixture<DocumentsTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentsTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
