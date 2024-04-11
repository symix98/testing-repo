import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTimelineComponent } from './document-timeline.component';

describe('DocumentTimelineComponent', () => {
  let component: DocumentTimelineComponent;
  let fixture: ComponentFixture<DocumentTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
