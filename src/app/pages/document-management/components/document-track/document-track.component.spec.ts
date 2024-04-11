import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTrackComponent } from './document-track.component';

describe('DocumentTrackComponent', () => {
  let component: DocumentTrackComponent;
  let fixture: ComponentFixture<DocumentTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentTrackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
