import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Data } from '../provider/data';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiService } from 'src/app/core/services/api.service';
import { Widgets } from 'src/app/core/models/widgets.model';
import { componentsWidgets } from 'src/app/pages/dashboard/shared/models/componentsWidgets';


@Component({
  selector: 'app-components-menu',
  templateUrl: './components-menu.component.html',
  styleUrls: ['./components-menu.component.scss']
})
export class ComponentsMenuComponent implements OnInit, OnDestroy {

  @Output() componentChosen = new EventEmitter<any>();

  panelMenuItems: MenuItem[] = [];

  isPanelMenuVisible: boolean = false;
  isCustomizeVisible: boolean = true;
  customizeButtonText: string = "Add Widget";

  toggleDisable: string = '';

  subscriptions = new Subscription();

  widgetArray: Widgets[];

  panelItemsToDisable: any[] = [];

  constructor(private data: Data, private apiService: ApiService) {
    this.getWidgets();
  }


  ngOnInit(): void {
    this.subscriptions.add(this.data.sharedMessage.subscribe(item => {
      if (item) {
        // console.log("Item" + item);
        const componentName = item;
        // console.log("component Name" + componentName);
        this.toggleDisable = componentName.trim();
        this.updatePanel(this.toggleDisable);

      }
    }));

    this.subscriptions.add(this.data.sharedComponentLoadedMessage.subscribe(item => {
      // console.log("from after view init");
      const componentToBeDisabled = item.split(',');
      //  console.log(componentToBeDisabled);
      if (item) {

        componentToBeDisabled.forEach(elem => {
          this.panelItemsToDisable.push(elem);
        })

      }
    }));

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getWidgets() {
    this.subscriptions.add(this.apiService.get(ApiURL.widgets).subscribe(widget => {
      this.widgetArray = widget;
      this.appendWidgets();
      if (this.panelItemsToDisable) {
        this.panelItemsToDisable.forEach(elem => {
          this.updatePanelDisableEntry(elem);
        })
      }
    }));
  }

  appendWidgets() {
    //KPI //Constraints //CWP //IWP //Global
    let elements: MenuItem[] = [];

    this.widgetArray.forEach(widget => {
      const index = elements.findIndex(x => x.label == widget.category);
      let element: MenuItem = {};

      //command: (event) => this.clicked(event, KpiTotalManHours)

      element.label = widget.name;
      element.icon = 'pi pi-fw pi-plus';
      element.tabindex = widget.widgetId;
      element.disabled = false;
      element.command = (event) => this.clicked(event, componentsWidgets[widget.widgetId]);

      if (index < 0) {
        let x: MenuItem = {};
        x.label = widget.category;
        x.icon = 'pi pi-fw pi-pencil';
        x.items = [];
        x.items.push(element);
        elements.push(x);
      }
      else {
        elements[index].items.push(element);
      }
    });

    this.panelMenuItems = elements;
  }

  clicked(event, args) {

    // if a component is chosen, it should become disabled from the menu
    event.item.disabled = true;
    this.componentChosen.emit(args);

  }

  showPanel() {
    this.isPanelMenuVisible = !this.isPanelMenuVisible;
    this.customizeButtonText = this.isPanelMenuVisible ? "Close" : "Add Widget";
  }


  // this function is used to make the component that has been removed from the layout available from the menu
  updatePanel(componentToFind) {

    // console.log(componentToFind);
    if (componentToFind) {
      this.panelMenuItems.map(item => {
        item.items.map(elem => {
          if (elem.tabindex == componentToFind) {
            elem.disabled = false;
            this.panelMenuItems = [...this.panelMenuItems];
          }
        })
      })
    }

  }


  // this function is used to make the component that has been added to the layout disabled from the menu
  // a widget can only be added once in a layout
  updatePanelDisableEntry(componentToFind) {
    if (componentToFind) {
      this.panelMenuItems.map(item => {
        item.items.map(elem => {
          if (elem.tabindex == componentToFind) {
            elem.disabled = true;
            this.panelMenuItems = [...this.panelMenuItems];
          }
        })
      })
    }

  }
}
