import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentNumbering } from './document-numbering.component';

describe('DocumentNumbering', () => {
  let component: DocumentNumbering;
  let fixture: ComponentFixture<DocumentNumbering>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentNumbering ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentNumbering);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
