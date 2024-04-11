import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupedSupportListComponent } from './grouped-support-list.component';

describe('GroupedSupportListComponent', () => {
  let component: GroupedSupportListComponent;
  let fixture: ComponentFixture<GroupedSupportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupedSupportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedSupportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
