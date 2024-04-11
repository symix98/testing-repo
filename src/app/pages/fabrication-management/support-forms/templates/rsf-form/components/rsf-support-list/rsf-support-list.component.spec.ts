import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsfSupportListComponent } from './rsf-support-list.component';

describe('RsfSupportListComponent', () => {
  let component: RsfSupportListComponent;
  let fixture: ComponentFixture<RsfSupportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsfSupportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RsfSupportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
