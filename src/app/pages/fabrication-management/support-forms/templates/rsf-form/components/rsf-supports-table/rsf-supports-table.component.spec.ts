import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsfSupportsTableComponent } from './rsf-supports-table.component';

describe('RsfSupportsTableComponent', () => {
  let component: RsfSupportsTableComponent;
  let fixture: ComponentFixture<RsfSupportsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsfSupportsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RsfSupportsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
