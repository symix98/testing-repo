import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentProperties } from './document-properties.component';

describe('DocumentProperties', () => {
  let component: DocumentProperties;
  let fixture: ComponentFixture<DocumentProperties>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentProperties ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentProperties);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
