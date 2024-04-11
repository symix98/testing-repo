import { Component, OnInit, Input, ViewChildren, ComponentFactoryResolver, QueryList, OnDestroy, AfterViewInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Data } from '../shared/provider/data';
import { componentsWidgets } from 'src/app/pages/dashboard/shared/models/componentsWidgets';
import { Subscription } from 'rxjs';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { AddComponent } from 'src/app/pages/dashboard/directive/addComponent.directive';
import { DashboardDetails } from 'src/app/core/models/dashboard-details.model';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/core/services/security.service';

@Component({
  selector: 'layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  // the input is passed from the parent component dashboard
  @Input() dashboardId: string;
  @Input() column: number;
  @Input() overview: boolean;



  // the URL will be used for the GET request to retrieve the data of the logged in user
  url: string;

  columnToArray: number[] = [];
  customizeDash: boolean = false;
  customizeButtonVisible: boolean = true;
  loading: boolean = false;

  @ViewChildren(AddComponent) addComponent: QueryList<AddComponent>;

  components = componentsWidgets;
  currentComponent = null;
  subscriptions = new Subscription();

  componentLocation: number = 0;


  // array that will hold the current components that are in the DOM
  componentsLayout = [];
  testComponent = null;

  //drag drop start

  draggedElement = null;
  draggedComponentKey = null;
  draggedComponent = null;

  // drag drop end


  msgToShare: string = '';

  // this array will store the components from the database
  dashboardDetails: DashboardDetails[] = [];

  // for POST - only send the newly added items
  dashboardDetailsToSend: DashboardDetails[] = [];

  // for PUT - to change an already existing item
  dashboardDetailsToUpdate: DashboardDetails[] = [];

  // for DELETE - to delete an already existing item from the database
  dashboardDetailsToDelete: number[] = [];

  dashboardDetailElement: DashboardDetails = {};

  counter: number = 0;
  constructor(private componentFactoryResolver: ComponentFactoryResolver, private compData: Data,
    private confirmationService: ConfirmationService,
    private apiService: ApiService,
    private utilitiesService: UtilitiesService, private router: Router, private securityService: SecurityService) { }

  ngOnInit(): void {
    this.customizeDash = false;
    this.customizeButtonVisible = true;

    //this.resetProvider();

    this.url = ApiURL.dashboard_details + '/' + this.dashboardId;

    this.columnToArray = [...Array(this.column).keys()];
    //console.log(this.columnToArray);
    // this.getDashboardWidgets();

    if (this.overview) {
      this.componentLocation++;
    }

    this.subscriptions.add(this.compData.sharedMessage.subscribe(item => {
      if (item) {
        // console.log('I AM THE MSG CALLING REMOVE');
        const toRemove = this.components[item];
        this.removeComponent(toRemove);
        this.deleteComponent(toRemove);
      }
    }));

    this.subscriptions.add(this.compData.sharedComponentDraggedMessage.subscribe(elem => {
      // console.log("dragged component"+elem);
      if (elem) {
        this.draggedComponentKey = this.components[elem];
        this.draggedElement = this.draggedComponentKey;
        this.testComponent = this.draggedComponentKey;
      }
    }));

  }

  ngAfterViewInit() {
    this.getDashboardWidgets();
  }

  customizeDashboard() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to edit dashboard?',
      header: 'Edit Dashboard?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.customizeDash = !this.customizeDash;
        this.customizeButtonVisible = false;
        this.compData.nextMessageDashboardEditMode(true);
      },
      reject: () => this.confirmationService.close()
    });

  }

  getDashboardWidgets() {
    this.msgToShare = '';

    this.subscriptions.add(this.apiService.get(this.url).subscribe(dashDetails => {

      this.dashboardDetails = [...dashDetails];
      this.dashboardDetails.map(elem => {
        const componentDetailsToAdd = componentsWidgets[elem.widgetId];
        const componentDetailsToAddColumn = +elem.section;
        this.add(componentDetailsToAdd, componentDetailsToAddColumn - 1);

      })

    },

      () => {
        this.utilitiesService.notifyError('There was an error loading widgets');
      }));
  }


  getDashboardWidgetsAfterSuccess() {

    let msgToSend = '';
    this.msgToShare = '';
    this.dashboardDetails = [];
    this.dashboardDetailElement = {};


    this.subscriptions.add(this.apiService.get(this.url).subscribe(dashDetails => {
      this.dashboardDetails = [...dashDetails];
      this.dashboardDetails.map(elem => {
        this.msgToShare += elem.widgetId + ',';

      })
      msgToSend = this.msgToShare.slice(0, -1);
      this.compData.nextMessageComponentLoaded(msgToSend);
    },

      () => {
        this.utilitiesService.notifyError('There was an error loading widgets');
      }));
  }


  // this function is used to dynamically create components on button click
  add(args, colIndex = 0) {

    this.dashboardDetailElement = {};
    const queryToArray = this.addComponent.toArray();
    const currentComponent = args;
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(currentComponent as any);
    let viewContainerRef = queryToArray[colIndex].viewContainerRef;
    let componentRef = viewContainerRef.createComponent(componentFactory);
    this.componentsLayout.push(componentRef);

    // check if the component is already in the database
    const componentKey = Object.keys(this.components).find(k => this.components[k] === args);
    const componentIndex = this.dashboardDetails.findIndex(x => x.widgetId == componentKey);

    if (componentIndex < 0) {
      this.dashboardDetailElement.widgetId = componentKey;
      this.dashboardDetailElement.section = String(colIndex + 1);
      this.dashboardDetailElement.dashboardId = this.dashboardId;
      this.dashboardDetailsToSend.push(this.dashboardDetailElement);
    }

    this.msgToShare += componentKey + ',';
    this.compData.nextMessageComponentLoaded(this.msgToShare.slice(0, -1));


  }

  // this function is used to remove components from the DOM
  removeComponent(componentClass) {
    this.dashboardDetailElement = {};
    const component = this.componentsLayout.find((component) => component.instance instanceof componentClass);
    const componentIndex = this.componentsLayout.indexOf(component);
    if (componentIndex !== -1) {
      this.addComponent.forEach(elem => {
        elem.viewContainerRef.remove(elem.viewContainerRef.indexOf(component))
      })

      this.componentsLayout.splice(componentIndex, 1);
    }
  }

  // this function is used to know which components are deleted related to the database
  deleteComponent(componentClass) {

    // if the component is removed before submission, modifiy the database to send before sending the request to the database
    const componentKeyAddedDelete = Object.keys(this.components).find(k => this.components[k] === componentClass);
    const componentIndexAddedDelete = this.dashboardDetailsToSend.findIndex(x => x.widgetId == componentKeyAddedDelete);
    if (componentIndexAddedDelete !== -1) {
      this.dashboardDetailsToSend.splice(componentIndexAddedDelete, 1);
    }

    const componentIndexPutDelete = this.dashboardDetailsToUpdate.findIndex(x => x.widgetId == componentKeyAddedDelete);
    if (componentIndexPutDelete !== -1) {
      const itemToAddToDeleteArray = this.dashboardDetailsToUpdate[componentIndexPutDelete].id;
      this.dashboardDetailsToDelete.push(itemToAddToDeleteArray);
      this.dashboardDetailsToUpdate.splice(componentIndexPutDelete, 1);
    }

    // if the component was already in database and should now be deleted
    const componentKeyDelete = Object.keys(this.components).find(k => this.components[k] === componentClass);
    const componentIndexDelete = this.dashboardDetails.findIndex(x => x.widgetId == componentKeyDelete);

    if (componentIndexDelete !== -1) {
      const indexOfComponentToDelete = this.dashboardDetails[componentIndexDelete].id;
      this.dashboardDetails.splice(componentIndexDelete, 1);
      this.dashboardDetailsToDelete.push(indexOfComponentToDelete);

    }

  }


  dropDragged(e, colNum) {

    this.dashboardDetailElement = {};
    const queryToArray = this.addComponent.toArray();
    const currentComponent = this.testComponent;

    //console.log(currentComponent);
    if (this.draggedElement) {
      // remove component first from the DOM
      this.removeComponent(currentComponent);

      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(currentComponent as any);
      let viewContainerRef = queryToArray[colNum].viewContainerRef;
      let componentRef = viewContainerRef.createComponent(componentFactory);
      this.componentsLayout.push(componentRef);

      // if the component is dragged before submission, modifiy the database before sending the request to the database
      const componentKey = Object.keys(this.components).find(k => this.components[k] === currentComponent);
      const componentIndex = this.dashboardDetailsToSend.findIndex(x => x.widgetId == componentKey);
      if (componentIndex !== -1) {
        this.dashboardDetailsToSend[componentIndex].section = String(colNum + 1);
      }


      // if the component was already in database
      const componentKeyUpdate = Object.keys(this.components).find(k => this.components[k] === currentComponent);
      const componentIndexUpdate = this.dashboardDetails.findIndex(x => x.widgetId == componentKeyUpdate);

      if (componentIndexUpdate !== -1) {
        this.dashboardDetailElement = this.dashboardDetails[componentIndexUpdate];
        this.dashboardDetails.splice(componentIndexUpdate, 1);
        this.dashboardDetailElement.section = String(colNum + 1);
        this.dashboardDetailsToUpdate.push(this.dashboardDetailElement);
      }

      // if the component already exists in the database and was already dragged once, so is now in the update array
      const componentKeyUpdateArr = Object.keys(this.components).find(k => this.components[k] === currentComponent);
      const componentIndexUpdateArr = this.dashboardDetailsToUpdate.findIndex(x => x.widgetId == componentKeyUpdateArr);

      if (componentIndexUpdateArr !== -1) {
        this.dashboardDetailElement = this.dashboardDetailsToUpdate[componentIndexUpdateArr];
        this.dashboardDetailsToUpdate.splice(componentIndexUpdateArr, 1);
        this.dashboardDetailElement.section = String(colNum + 1);
        this.dashboardDetailsToUpdate.push(this.dashboardDetailElement);
      }
    }

    this.draggedElement = null;
  }



  saveLayout() {

    this.confirmationService.confirm({
      message: 'Are you sure you want to save dashboard?',
      header: 'Save Changes?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.sendChangesToDatabase();
      },
      reject: () => {
        this.cancelSave();
        this.confirmationService.close();
      }
    });

  }


  cancelSave() {
    this.resetElements();
  }

  resetElements() {
    this.dashboardDetailsToDelete = [];
    this.dashboardDetailsToSend = [];
    this.dashboardDetailsToUpdate = [];
    this.dashboardDetails = [];
    this.dashboardDetailElement = {};
    this.componentsLayout = [];
    this.loading = false;
    this.counter = 0;
    // the components are no longer in edit mode, the editing tools should be hidden
    this.customizeButtonVisible = true;
    this.customizeDash = false;
    this.compData.nextMessageDashboardEditMode(false);
    this.compData.nextMessageComponentDragged('');
    this.compData.nextMessage('');
    this.compData.nextMessageComponentLoaded('');

    const queryToArray = this.addComponent.toArray();
    const queryToArrayLength = queryToArray.length;
    let i = 0;
    while (i < queryToArrayLength) {
      queryToArray[i].viewContainerRef.clear();
      i++;
    }
    this.getDashboardWidgets();
  }


  postData(totalCount: number) {

    // POST to the database the new items that were added to the dashboard

    if (this.dashboardDetailsToSend.length > 0) {

      let postCounter = 0;
      this.dashboardDetailsToSend.forEach(item => {
        this.subscriptions.add(this.apiService.post(ApiURL.dashboard_details, item).subscribe(item => {
          this.counter++;
          postCounter++;
          if (postCounter === this.dashboardDetailsToSend.length) {
            this.dashboardDetailsToSend = [];
            this.utilitiesService.notifySuccess('Data was successfully sent');
          }

          if (this.counter == totalCount) {
            this.loading = false;
            this.getDashboardWidgetsAfterSuccess();
          }

        },
          () => {
            this.loading = false;
            this.resetElements();
            this.utilitiesService.notifyError('Data was not successfully sent');

          }

        ));
      })
    }

  }

  putData(totalCount: number) {

    // PUT to the database the updated items of the dashboard

    if (this.dashboardDetailsToUpdate.length > 0) {
      let putCounter = 0;
      this.dashboardDetailsToUpdate.forEach(item => {
        this.subscriptions.add(this.apiService.put(ApiURL.dashboard_details, item).subscribe(item => {
          this.counter++;
          putCounter++;
          if (putCounter == this.dashboardDetailsToUpdate.length) {
            this.dashboardDetailsToUpdate = [];
            this.utilitiesService.notifySuccess('Update was successful');
          }

          if (this.counter == totalCount) {
            this.loading = false;
            this.getDashboardWidgetsAfterSuccess();
          }



        },
          () => {
            this.loading = false;
            this.resetElements();
            this.utilitiesService.notifyError('Update was not successfully sent')
          }
        ));
      })
    }


  }

  deleteData(totalCount: number) {
    // DELETE from database an already existing item

    if (this.dashboardDetailsToDelete.length > 0) {
      let deleteCounter = 0;
      this.dashboardDetailsToDelete.forEach(item => {
        this.subscriptions.add(this.apiService.delete(`${ApiURL.dashboard_details}/${item}`).subscribe(elem => {
          this.counter++;
          deleteCounter++;
          if (deleteCounter == this.dashboardDetailsToDelete.length) {
            this.dashboardDetailsToDelete = [];
            this.utilitiesService.notifySuccess('Delete was successful');
          }

          if (this.counter == totalCount) {
            this.loading = false;
            this.getDashboardWidgetsAfterSuccess();
          }
        },
          () => {
            this.loading = false;
            this.resetElements();
            this.utilitiesService.notifyError('Delete was not successfully sent');
          }
        ));
      })
    }

  }

  sendChangesToDatabase() {
    this.counter = 0;
    const totalCount = this.dashboardDetailsToDelete.length + this.dashboardDetailsToUpdate.length + this.dashboardDetailsToSend.length;
    // the components are no longer in edit mode, the editing tools should be hidden
    this.customizeButtonVisible = true;
    this.customizeDash = false;
    this.compData.nextMessageDashboardEditMode(false);

    if (totalCount > 0) {
      this.loading = true;
      this.postData(totalCount);
      this.putData(totalCount);
      this.deleteData(totalCount);
    }

    else {
      this.loading = false;
    }


  }


  // this function was added to reset the Behavior Subject values
  resetProvider() {
    this.compData.nextMessage('');
    this.compData.nextMessageDashboardEditMode(false);
    this.compData.nextMessageComponentDragged('');
    this.compData.nextMessageComponentLoaded('');
  }


  ngOnDestroy() {
    // this function was added to reset the Behavior Subject values since unsubscribing is not enough
    this.resetProvider();
    this.subscriptions.unsubscribe();
  }

}
