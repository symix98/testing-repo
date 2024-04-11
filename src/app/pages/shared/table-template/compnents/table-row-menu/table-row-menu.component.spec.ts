import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRowMenuComponent } from './table-row-menu.component';

describe('TableRowMenuComponent', () => {
  let component: TableRowMenuComponent;
  let fixture: ComponentFixture<TableRowMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableRowMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableRowMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
