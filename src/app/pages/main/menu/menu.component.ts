import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SecurityService } from 'src/app/core/services/security.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']

})
export class MenuComponent implements OnInit {

  items: MenuItem[];
  model: any[];
  constructor(private securityService: SecurityService) {
  }

  ngOnInit(): void {
    this.items = [
      { icon: 'pi pi-fw pi-home', routerLink: ['dashboard'] ,tooltipOptions: { tooltipLabel: "Dashboard", tooltipPosition: "right" } },
      { icon: 'pi pi-fw pi-desktop', routerLink: ['documents/libraries'],tooltipOptions: { tooltipLabel: "WorkSpace", tooltipPosition: "right" } },
      { icon: 'pi pi-fw pi-briefcase', routerLink: ['document-filter'],tooltipOptions: { tooltipLabel: "Document Register", tooltipPosition: "right" } },
      { icon: 'pi pi-fw pi-share-alt', routerLink: ['documents/transmittal'],tooltipOptions: { tooltipLabel: "Transmittal", tooltipPosition: "right" } },
      //   { label: 'Requests', items: [
      //     { label: 'My Requests', icon: 'pi pi-fw pi-book', routerLink: ['forms/request-list'] },
      //     // { label: 'Create RSF Form', icon: 'pi pi-fw pi-book', routerLink: ['forms/rsf-form'] },
      //   ]},
      //   {label : 'Support Engineering', items: [
      //     { label: 'Material Takeoff (MTO)', icon: 'pi pi-fw pi-compass', routerLink: ['support-fabrication/mto/mto-list'] },
      //     { label: 'MTO Pictorial', icon: 'pi pi-fw pi-images', routerLink: ['support-fabrication/digital-pictorial'] },
      //   ]},
      //   { label: 'Supports Fabrication', items:[
      //     { label: 'All Supports', icon: 'pi pi-fw pi-share-alt', routerLink: ['support-fabrication/supports'] },
      //     { label: 'Forecasted Support', icon: 'pi pi-fw pi-chart-bar', routerLink: ['support-fabrication/supports-forecast'] },
      //     // { label: '', icon: 'pi pi-fw pi-briefcase', routerLink: ['support-fabrication/supports'] },
      //   ]},
      { icon:'pi pi-box', routerLink: ['/role-groups'], tooltipOptions: { tooltipLabel: "Groups", tooltipPosition: "right" } },
      { icon: 'pi pi-fw pi-sitemap', routerLink: ['/gen-form'], tooltipOptions: { tooltipLabel: "Work FLows", tooltipPosition: "right" } },
      //   //  { label: 'Reports', icon: 'pi pi-fw pi-book', routerLink: ['/reports'] },
      //   //  { label: 'Documents', icon: 'pi pi-fw pi-book', routerLink: ['/documents'] },
      //   // { label: 'Fab-Form', icon: 'pi pi-fw pi-book', routerLink: ['/fab-init'] },
      //   //  { label: 'Services', icon: 'pi pi-fw pi-server', routerLink: ['/services'] },
      //   //  { label: 'Material-Takeoff', icon: 'pi pi-fw pi-slack', routerLink: ['/materials-takeoff'] },
      { icon: 'pi pi-fw pi-wrench', tooltipOptions: { tooltipLabel: "Settings", tooltipPosition: "right" },
        items: [
          { icon: 'pi pi-fw pi-server', routerLink: ['/settings/reference-tables'], tooltipOptions: { tooltipLabel: "Reference Tables", tooltipPosition: "right" } },
          { icon: 'pi pi-fw pi-book', routerLink: ['/settings/project-info'], tooltipOptions: { tooltipLabel: "Project Info", tooltipPosition: "right" } },
          { icon: 'pi pi-fw pi-cog', routerLink: ['/settings/project-settings'], tooltipOptions: { tooltipLabel: "Project Settings", tooltipPosition: "right" } },
          { icon: 'pi pi-fw pi-lock', routerLink: ['/settings/users'], tooltipOptions: { tooltipLabel: "User Settings", tooltipPosition: "right" } }
        ],
      }
    ]
  }

}
