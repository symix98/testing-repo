import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageServicesFormFieldsComponent } from './storage-services-form-fields.component';

describe('StorageServicesFormFieldsComponent', () => {
  let component: StorageServicesFormFieldsComponent;
  let fixture: ComponentFixture<StorageServicesFormFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorageServicesFormFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageServicesFormFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
