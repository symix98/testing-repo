import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageServicesFormComponent } from './storage-services-form.component';

describe('StorageServicesFormComponent', () => {
  let component: StorageServicesFormComponent;
  let fixture: ComponentFixture<StorageServicesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorageServicesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageServicesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
