import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../main.component';
import { KeycloakService } from 'keycloak-angular';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AppUsers } from 'src/app/core/models/app-users.model';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ProjectInfo } from 'src/app/core/models/project-info.model';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { SecurityService } from 'src/app/core/services/security.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})

export class TopBarComponent implements OnInit {

  userid: any;
  role: String;
  name: String;
  email: String;
  attachment: any;
  username: String;
  loading: boolean;
  attachmentId: any;
  appUsers: AppUsers[];
  profileAttachment: any;
  profileLogoExists: boolean;
  subscriptions = new Subscription();
  projectInfo: ProjectInfo = new ProjectInfo();
  profileLogo: String = 'assets/images/user.svg';

  constructor(
    private router: Router, private apiService: ApiService, public app: MainComponent,
    public device: DeviceDetectorService, private utilities: UtilitiesService, private keycloakService: KeycloakService,
    private securityService: SecurityService,
  ) {
    //To Do
    //Get Logged in user to show his/her name
  }

  async ngOnInit(): Promise<void> {
    this.username = this.keycloakService.getUsername();
    let e = await this.utilities.getCurrentAppUser();
    this.userid = e.userId;
    this.name = e.name;
    this.email = e.email;
    this.role = e.roles[0] ? e.roles[0].description : null;
    this.getProjectInfo();
  }

  openUserProfile() {
    this.router.navigate(['profile']);
  }

  getProjectInfo() {
    this.loading = true;

    this.apiService.get(ApiURL.appusers).subscribe((res) => {
      this.appUsers = res;
      this.appUsers.forEach((e) => {
        if (e.email == this.utilities.getLoggedinAccount().email) {
          this.userid = e.userId;
          this.name = e.name;
          this.email = e.email;
          this.role = e.roles[0] ? e.roles[0].description : null;
        }
      })
      this.subscriptions.add(this.apiService.get(ApiURL.attachements + '?description.equals=' + this.userid + 'Profile').subscribe((res) => {
        this.attachment = res
        this.attachmentId = this.attachment[0]?.id;
        if (this.attachment.length > 0) {
          this.profileAttachment = this.attachment[0]
          this.profileLogo = 'data:image/png;base64,' + this.attachment[0].data;
        }
        if (this.attachment) {
          this.getAttachments();
        }
      })
      );
    })
  }

  getAttachments() {
    this.subscriptions.add(
      this.apiService.get(ApiURL.attachements + "?description.equals=" + this.userid + "Profile").subscribe((res) => {
        if (res.length > 0) {
          const profileAttachment = res[0]
          console.log('this.profileAttachment', profileAttachment);
          this.profileLogoExists = profileAttachment ? true : false;
          if (this.profileLogoExists)
            this.profileLogo = 'data:image/png;base64,' + profileAttachment.data;
        }
        this.loading = false;
      })
    );
  }

  openInbox() {
    console.log('Inbox Clicked');
    // this.router.navigate(['forms/inbox']);
  }

  async logout() {
    // await this.securityService.clear();
    // window.location.href = environment.keycloak.url + "/realms/" + environment.keycloak.realm + "/protocol/openid-connect/logout"
    // await this.securityService.clear();
    
    await this.keycloakService.logout();
  }

}