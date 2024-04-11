import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentMultiplepropertiesComponent } from './document-multipleproperties.component';

describe('DocumentMultiplepropertiesComponent', () => {
  let component: DocumentMultiplepropertiesComponent;
  let fixture: ComponentFixture<DocumentMultiplepropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentMultiplepropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentMultiplepropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
