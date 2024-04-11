import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocDatasourceComponent } from './doc-datasource.component';

describe('DocDatasourceComponent', () => {
  let component: DocDatasourceComponent;
  let fixture: ComponentFixture<DocDatasourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocDatasourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocDatasourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
