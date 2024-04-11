import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class Data {
    private message = new BehaviorSubject('');
    sharedMessage = this.message.asObservable();

    nextMessage(message: any) {
        this.message.next(message);
    }

    // this will be used for when the layout of the dashboard is being retrieved from the database
    // the components menu needs to know that this component already exists on the dashboard and needs to be disabled
    private componentLoaded = new BehaviorSubject('');
    sharedComponentLoadedMessage = this.componentLoaded.asObservable();

    nextMessageComponentLoaded(message: any) {
        this.componentLoaded.next(message);
    }


    // Used to keep track of the dragged component to the layout

    private componentDragged = new BehaviorSubject('');
    sharedComponentDraggedMessage = this.componentDragged.asObservable();

    nextMessageComponentDragged(message: any) {
        this.componentDragged.next(message);
    }

    // Used to keep track if the dashboard is in edit mode or not

    private dashboardEditMode = new BehaviorSubject(false);
    sharedDashboardEditModeMessage = this.dashboardEditMode.asObservable();

    nextMessageDashboardEditMode(message: any) {
        this.dashboardEditMode.next(message);
    }
}