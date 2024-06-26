import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private menuSource = new Subject<string>();
  private resetSource = new Subject<void>();

  menuSource$ = this.menuSource.asObservable();
  resetSource$ = this.resetSource.asObservable();

  constructor() { }

  onMenuStateChange(key: string) {
    this.menuSource.next(key);
  }

  reset() {
    this.resetSource.next();
  }
}
