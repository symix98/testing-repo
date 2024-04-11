import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocGeneralPropertiesTabComponent } from './doc-general-properties-tab.component';

describe('DocGeneralPropertiesTabComponent', () => {
  let component: DocGeneralPropertiesTabComponent;
  let fixture: ComponentFixture<DocGeneralPropertiesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocGeneralPropertiesTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocGeneralPropertiesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
