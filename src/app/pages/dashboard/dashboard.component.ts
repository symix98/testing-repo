import { Component, OnInit } from '@angular/core';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiService } from 'src/app/core/services/api.service';
import { Account } from 'src/app/core/models/account.model';
import { Dashboard } from 'src/app/core/models/dashboard.model';
import { DashboardLayouts } from 'src/app/core/models/dashboard-layouts.model';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { AppUsers } from 'src/app/core/models/app-users.model';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  loggedInUserAccount: Account;
  userEmail: string;
  layoutColumn: number;
  layoutOverview: boolean;
  layoutLoaded: boolean;

  dashboard: Dashboard;
  dashboardLayout: DashboardLayouts;

  appUser: AppUsers;

  dashboardId: string;

  noDataFound: boolean;
  loading: boolean = false;

  constructor(private apiService: ApiService, private utilitiesService: UtilitiesService) {
    this.layoutLoaded = false;
  }

  ngOnInit(): void {
    // console.log("USERRRR");
    // this.loggedInUserAccount = this.utilitiesService.getLoggedinAccount();
    // if (this.loggedInUserAccount) {
    //   this.userEmail = this.loggedInUserAccount.email;
    //   if (this.userEmail) {
    //     //start by checking if the user has a dashboard defined by email
    //     //the user dashboard takes precedence over the role based dashboard
         
    //   }
    // }
    this.getDashboard('Default');  
  }

  //this function will return the dashboard information by user
  getDashboard(dashboardId: string) {
    const url = ApiURL.dashboards + '/' + dashboardId;
    this.apiService.get(url).subscribe(dashboard => {
      this.dashboard = dashboard;
      if (this.dashboard) {
        this.dashboardId = dashboardId;
        this.getDashboardLayout(this.dashboard.dashboardLayoutId);
      }
      //if the user doesn't have a dashboard by user email, get the dashboard defined for the user's role
      else {
        // this.getUserRole(this.userEmail);
      }
    }, () => {
      this.layoutLoaded = false;
      this.noDataFound = false;
      this.utilitiesService.notifyError('There was an error loading the dashboard');
    });
  }

  //get the logged in user's role 
  getUserRole(loggedInUser) {
    let query: ApiQuery = null;
    query = {
      filter: new Map<string, string>([['email', loggedInUser]])
    };
    this.apiService.get(ApiURL.appusers, query).subscribe(result => {
      if (result.length > 0) {
        this.appUser = result[0];
        this.dashboardId = this.appUser?.roles[0]?.roleId;
        //if the user has a role defined, get the dashboard by role
        if (this.dashboardId) {
          this.getDashboardByRole(this.dashboardId);
        }
        else {
          //if no role is found for the logged in user, show the default dashboard
          this.getDashboard('Default');
        }
      } else {
        this.getDashboard('Default');
      }
    }, () => {
      this.layoutLoaded = false;
      this.noDataFound = true;
      this.utilitiesService.notifyError('Error getting user by role');
    })
  }

  getDashboardByRole(dashboardId: string) {
    const url = ApiURL.dashboards + '/' + dashboardId;
    this.apiService.get(url).subscribe(dashboard => {
      this.dashboard = dashboard;
      if (this.dashboard) {
        this.dashboardId = dashboardId;
        this.getDashboardLayout(this.dashboard.dashboardLayoutId);
      }
      else {
        //if no dashboard is defined by role, show the default dashboard
        this.getDashboard('Default');
      }
    }, () => {
      this.layoutLoaded = false;
      this.noDataFound = true;
      this.utilitiesService.notifyError('There was an error loading the dashboard');
    });
  }

  // this function will return the layout of the dashboard that the user has
  getDashboardLayout(dashboardLayoutId: string) {
    this.loading = true;
    const url = ApiURL.dashboard_layout_id + '/' + dashboardLayoutId;
    this.apiService.get(url).subscribe(layout => {
      if (layout && layout.length > 0) {
        this.dashboardLayout = layout;
        const columns = this.dashboardLayout[0].columns;
        const overview = this.dashboardLayout[0].overview;
        this.layoutColumn = columns;
        this.layoutOverview = overview;
        this.layoutLoaded = true;
        this.loading = false;
      }
      else {
        this.layoutLoaded = false;
        this.noDataFound = true;
        this.loading = false;
      }

    }, (err) => {
      if (err.status === 404) {
        this.layoutLoaded = false;
        this.noDataFound = true;
      }
      else {
        this.utilitiesService.notifyError('There was an error loading the dashboard layout of the user');
      }
      this.layoutLoaded = false;
      this.noDataFound = true;
      this.loading = false;
    });

  }

}
