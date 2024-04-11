import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHyperlinkDialogComponent } from './create-hyperlink-dialog.component';

describe('CreateHyperlinkDialogComponent', () => {
  let component: CreateHyperlinkDialogComponent;
  let fixture: ComponentFixture<CreateHyperlinkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateHyperlinkDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateHyperlinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
