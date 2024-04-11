import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFolderPropsComponent } from './add-folder-props.component';

describe('AddFolderPropsComponent', () => {
  let component: AddFolderPropsComponent;
  let fixture: ComponentFixture<AddFolderPropsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFolderPropsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFolderPropsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
