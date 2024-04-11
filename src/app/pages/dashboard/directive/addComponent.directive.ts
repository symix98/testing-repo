import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[add-component]',
})
export class AddComponent {
  constructor(public viewContainerRef: ViewContainerRef) { }
}