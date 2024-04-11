import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsDataviewComponent } from './products-dataview.component';

describe('ProductsDataviewComponent', () => {
  let component: ProductsDataviewComponent;
  let fixture: ComponentFixture<ProductsDataviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsDataviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsDataviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
