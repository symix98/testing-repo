import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-widget-my-requests',
  templateUrl: './widget-my-requests.component.html',
  styleUrls: ['./widget-my-requests.component.scss']
})
export class WidgetMyRequestsComponent implements OnInit {

  // These are the values needed by the widget component
  wigdetComponentName: string = 'widget_my_requests';
  widgetTitle: string = 'My Requests';

  constructor() { }

  ngOnInit(): void {
  }

}
