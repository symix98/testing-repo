import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowViewerComponent } from './flow-viewer.component';

describe('FlowViewerComponent', () => {
  let component: FlowViewerComponent;
  let fixture: ComponentFixture<FlowViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlowViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
