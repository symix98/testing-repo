import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { RoutingParam } from '../miscellaneous/routing-param.template';

@Injectable({ providedIn: 'root' })
export class RoutingService {

  routingParams: RoutingParam;
  sessionKey: string = "routing_params";

  constructor(
    private router: Router,
    private location: Location,
    private sessionStorage: SessionStorageService) { }

  navigateForward(url: string, params?: RoutingParam, id?: any) {
    this.writeRoutingParams(params);
    this.router.navigate([url, id]);
  }

  navigateBack() {
    this.location.back();
  }

  getCurrentRoute(): string {
    return this.router.url;
  }

  writeRoutingParams(params?: RoutingParam) {
    let routingparams: any;
    if (params) {
      routingparams = {};
      if (params.currentURL) {
        routingparams.currentURL = params.currentURL;
      }
      if (params.pageIndex) {
        routingparams.pageIndex = params.pageIndex;
      }
      if (params.pageSize) {
        routingparams.pageSize = params.pageSize;
      }
      if (params.sort) {
        routingparams.sort = params.sort;
      }
      if (params.tabIndex) {
        routingparams.tabIndex = params.tabIndex;
      }
      this.sessionStorage.store(this.sessionKey, routingparams);
    }
  }

  readRoutingParams(): RoutingParam {
    let routingParams: RoutingParam = null;
    const params: RoutingParam = this.sessionStorage.retrieve(this.sessionKey);

    if (params && params.currentURL != null && this.getCurrentRoute() == params.currentURL) {
      routingParams = new RoutingParam();
      routingParams.currentURL = params.currentURL;
      routingParams.pageIndex = params.pageIndex;
      routingParams.pageSize = params.pageSize;
      routingParams.tabIndex = params.tabIndex;
      routingParams.sort = params.sort;
      this.sessionStorage.clear(this.sessionKey);
    }
    return routingParams;
  }
}
