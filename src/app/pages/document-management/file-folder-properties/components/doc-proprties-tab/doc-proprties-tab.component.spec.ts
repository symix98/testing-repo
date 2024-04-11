import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocProprtiesTabComponent } from './doc-proprties-tab.component';

describe('DocProprtiesTabComponent', () => {
  let component: DocProprtiesTabComponent;
  let fixture: ComponentFixture<DocProprtiesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocProprtiesTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocProprtiesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
