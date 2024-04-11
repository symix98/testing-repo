import { Input, Component, OnDestroy, OnInit } from '@angular/core';
import { Dialog } from "primeng/dialog";
import { Data } from 'src/app/pages/dashboard/shared/provider/data';
import { Subscription } from 'rxjs';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit, OnDestroy {

  //Mandatory - this field should match the widget_id as defined in the widget table
  @Input() wigdetComponentName: string;

  //Optional, if not provided then widget is not kpi
  @Input() isKpi: boolean;
  @Input() KPIClass: string;

  //Optional when we want to use a panel
  @Input() widgetTitle: string;

  // used to know if the widget should present itself in edit mode or not
  componentInEditMode: boolean = false;

  // used to maximize the widget
  displayMaximizable: boolean = false;
  max: boolean = false;

  subscription: Subscription;

  constructor(private data: Data, private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    // the widget needs to know if it should present itself in edit mode or not 
    // the signal is sent from the layout component
    this.subscription = this.data.sharedDashboardEditModeMessage.subscribe(elem => {
      this.componentInEditMode = elem;
    })
  }

  // this function is called when the maximize button is clicked in the chart panel
  maximizeWidget() {
    this.displayMaximizable = true;
    this.max = true;
  }

  // this is a function to mazimize the p-dialog containing the component
  maximizeDialog(args, elem: Dialog) {
    elem.maximize();
  }

  dragStart(args) {
    const draggedComponent = args;
    this.data.nextMessageComponentDragged(draggedComponent);
  }

  dragEnd(e) {
  }

  removeElement(args) {
    const componentToRemove = args;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete component?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.data.nextMessage(componentToRemove);
      },
      reject: () => this.confirmationService.close()
    });


  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
