import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachFileToDocComponent } from './attach-file-to-doc.component';

describe('AttachFileToDocComponent', () => {
  let component: AttachFileToDocComponent;
  let fixture: ComponentFixture<AttachFileToDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachFileToDocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachFileToDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
