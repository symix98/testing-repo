import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { AccessDeniedPageComponent } from './access-denied-page/access-denied-page.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { MenuComponent } from './menu/menu.component';
import { MainRoutingModule } from 'src/app/core/modules/routing/main-routing.module';
import { SharedModule } from 'src/app/core/modules/shared.module';

@NgModule({
  declarations: [
    MainComponent,
    ErrorPageComponent,
    NotFoundPageComponent,
    AccessDeniedPageComponent,
    TopBarComponent,
    MenuComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MainRoutingModule
  ]
})
export class MainModule { }
