import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentFormWizzardComponent } from './document-form-wizzard.component';

describe('DocumentFormWizzardComponent', () => {
  let component: DocumentFormWizzardComponent;
  let fixture: ComponentFixture<DocumentFormWizzardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentFormWizzardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentFormWizzardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
