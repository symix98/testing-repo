import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDocPreviewComponent } from './shared-doc-preview.component';

describe('SharedDocPreviewComponent', () => {
  let component: SharedDocPreviewComponent;
  let fixture: ComponentFixture<SharedDocPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedDocPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedDocPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
