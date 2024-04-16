//Modules
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AppRoutingModule } from './core/modules/app-routing.module';
import { SharedModule } from './core/modules/shared.module';
import { MainModule } from './pages/main/main.module';

//Components
import { AppComponent } from './app.component';

//Services
import { initializeKeycloak } from './core/auth/auth.init';

// Misc
import { environment } from 'src/environments/environment';
import { MaterialsTakeoffComponent } from './pages/materials-takeoff/materials-takeoff.component';
import { MtoViewComponent } from './pages/materials-takeoff/mto-view/mto-view.component';
import { SupportPictorialFormComponent } from './pages/fabrication-management/Engineering/support-pictorial/components/support-pictorial-form/support-pictorial-form.component';
import { PopupMtoDetailsComponent } from './pages/shared/table-template/compnents/popup-mto-details/popup-mto-details.component';
import { TableIconComponent } from './pages/shared/table-template/compnents/table-icon/table-icon.component';
import { TableRowMenuComponent } from './pages/shared/table-template/compnents/table-row-menu/table-row-menu.component';
import { CommentComponent } from './pages/shared/comment/comment.component';
import { AddRoomComponent } from './pages/Room-Master/add-room/add-room.component';
import { EditRoomComponent } from './pages/Room-Master/edit-room/edit-room.component';



@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,

        HttpClientModule,
        SharedModule,
        MainModule,
        AppRoutingModule,
        KeycloakAngularModule,
        NgxWebstorageModule.forRoot({ prefix: environment.projectName.replace(/\s/g, '').toLowerCase(), separator: '-' })
    ],
    declarations: [
        AppComponent,
        MaterialsTakeoffComponent,
        MtoViewComponent,
        SupportPictorialFormComponent,
        PopupMtoDetailsComponent,
        TableIconComponent,
        TableRowMenuComponent,
        CommentComponent,
    ],
    providers: [
        { provide: APP_INITIALIZER, useFactory: initializeKeycloak, multi: true, deps: [KeycloakService] }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
