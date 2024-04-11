import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-custom-collapse',
  templateUrl: './custom-collapse.component.html',
  styleUrls: ['./custom-collapse.component.scss']
})
export class CustomCollapseComponent implements OnInit, AfterViewChecked {

  @Input() collapsed: boolean = false;

  constructor(private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private elRef: ElementRef) { }

  ngOnInit(): void {
  }

  ngAfterViewChecked() {
    let content = this.elRef.nativeElement.querySelector('.content');
    this.renderer.setStyle(content, 'maxHeight', this.collapsed ? content?.scrollHeight + "px" : null);
    this.cdr.detectChanges();
  }
}
