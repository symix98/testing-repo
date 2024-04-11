import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewRevisionDialogComponent } from './add-new-revision-dialog.component';

describe('AddNewRevisionDialogComponent', () => {
  let component: AddNewRevisionDialogComponent;
  let fixture: ComponentFixture<AddNewRevisionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewRevisionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewRevisionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
