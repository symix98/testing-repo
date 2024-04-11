import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocRelationsComponent } from './doc-relations.component';

describe('DocRelationsComponent', () => {
  let component: DocRelationsComponent;
  let fixture: ComponentFixture<DocRelationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocRelationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocRelationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
