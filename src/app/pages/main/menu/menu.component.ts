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
      { icon: 'pi pi-home', routerLink: ['/room-master'] ,tooltipOptions: { tooltipLabel: "Room Master", tooltipPosition: "right" } },
      { icon: 'pi pi-book', routerLink: ['/transactions'] ,tooltipOptions: { tooltipLabel: "Transactions", tooltipPosition: "right" } },
      // { icon: 'pi pi-fw pi-desktop', routerLink: ['documents/libraries'],tooltipOptions: { tooltipLabel: "WorkSpace", tooltipPosition: "right" } },
      // { icon: 'pi pi-fw pi-briefcase', routerLink: ['document-filter'],tooltipOptions: { tooltipLabel: "Document Register", tooltipPosition: "right" } },
      // { icon: 'pi pi-fw pi-share-alt', routerLink: ['documents/transmittal'],tooltipOptions: { tooltipLabel: "Transmittal", tooltipPosition: "right" } },
      // { icon:'pi pi-box', routerLink: ['/role-groups'], tooltipOptions: { tooltipLabel: "Groups", tooltipPosition: "right" } },
      // { icon: 'pi pi-fw pi-sitemap', routerLink: ['/gen-form'], tooltipOptions: { tooltipLabel: "Work FLows", tooltipPosition: "right" } },
      // { icon: 'pi pi-fw pi-wrench', tooltipOptions: { tooltipLabel: "Settings", tooltipPosition: "right" },
      //   items: [
      //     { icon: 'pi pi-fw pi-server', routerLink: ['/settings/reference-tables'], tooltipOptions: { tooltipLabel: "Reference Tables", tooltipPosition: "right" } },
      //     { icon: 'pi pi-fw pi-book', routerLink: ['/settings/project-info'], tooltipOptions: { tooltipLabel: "Project Info", tooltipPosition: "right" } },
      //     { icon: 'pi pi-fw pi-cog', routerLink: ['/settings/project-settings'], tooltipOptions: { tooltipLabel: "Project Settings", tooltipPosition: "right" } },
      //     { icon: 'pi pi-fw pi-lock', routerLink: ['/settings/users'], tooltipOptions: { tooltipLabel: "User Settings", tooltipPosition: "right" } }
      //   ],
      // }
    ]
  }

}
