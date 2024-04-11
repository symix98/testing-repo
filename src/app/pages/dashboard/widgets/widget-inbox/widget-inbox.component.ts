import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-widget-inbox',
  templateUrl: './widget-inbox.component.html',
  styleUrls: ['./widget-inbox.component.scss']
})
export class WidgetInboxComponent implements OnInit {

   // These are the values needed by the widget component
   wigdetComponentName: string = 'widget_inbox';
   widgetTitle: string = 'Inbox';

  constructor() { }

  ngOnInit(): void {
  }

}
