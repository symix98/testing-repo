import { Component, Input, OnInit } from '@angular/core';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-folder-security',
  templateUrl: './folder-security.component.html',
  styleUrls: ['./folder-security.component.scss']
})
export class FolderSecurityComponent implements OnInit {
  @Input() data: any;
  userRoles: any[] = [];
  userPermissions: any[] = [];
  permissionFor: string 
  isTableDisabled: boolean = true;
  selectedRole: any[];

  constructor(private apiService: ApiService,
              private utilitiesService: UtilitiesService) { }

  ngOnInit(): void {
    this.getUserRole();

    this.userPermissions = [
      { id: 1, permission: 'Full Control', allow: null, deny: null },
      { id: 2, permission: 'Modify', allow: null, deny: null },
      { id: 3, permission: 'Read & execute', allow: null, deny: null },
      { id: 4, permission: 'Read', allow: null, deny: null },
      { id: 5, permission: 'Write', allow: null, deny: null },
      { id: 6, permission: 'Special permissions', allow: null, deny: false }
    ];
  }

  getUserRole() {
    this.apiService.get(ApiURL.roles).subscribe(res => {
      if (res) {
        this.userRoles = res
      }
    }, (err) => {
      this.utilitiesService.notifyError("Error")
    })

  }


  userRoleSelection() {
    this.permissionFor = this.selectedRole.toString().toUpperCase()
    this.isTableDisabled = false;
  }
}
