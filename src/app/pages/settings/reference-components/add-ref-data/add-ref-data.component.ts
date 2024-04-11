import { Component, OnInit } from '@angular/core';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AcceptanceCode, Categories, Discipline, DocumentSubType, DocumentsType, Area, FilesType, Location, Organizer, Recipient, Roles, Status, SubArea } from 'src/app/core/models/files-type.model';


@Component({
  selector: 'app-add-ref-data',
  templateUrl: './add-ref-data.component.html',
  styleUrls: ['./add-ref-data.component.scss']
})

export class AddRefDataComponent implements OnInit {

  isDisabled: boolean = true;
  isInputDisabled: boolean = false;

  fileTypeName: string;
  fileTypeCode: string;
  fileTypeDesc: string;
  FilesType: FilesType;
  fileTypeRefType: boolean = false;

  documentTypeName: string;
  documentTypeCode: string;
  documentTypeDesc: string;
  DocumentsType: DocumentsType;
  documentTypeRefType: boolean = false;

  documentSubTypeName: string;
  documentSubTypeCode: string;
  documentSubTypeDesc: string;
  DocumentSubType: DocumentSubType;
  documentSubTypeRefType: boolean = false;

  disciplineName: string;
  disciplineCode: string;
  disciplineDesc: string;
  Discipline: Discipline;
  disciplineRefType: boolean = false;

  statusName: string;
  statusCode: string;
  statusDesc: string;
  Status: Status;
  statusRefType: boolean = false;

  organizerName: string;
  organizerCode: string;
  organizerType: string;
  organizerDesc: string;
  Organizer: Organizer;
  organizerRefType: boolean = false;

  recipientName: string;
  recipientCode: string;
  recipientType: string;
  recipientDesc: string;
  Recipient: Recipient;
  recipientRefType: boolean = false;

  acceptCodeNumber: number;
  acceptCodeName: string;
  AcceptanceCode: AcceptanceCode;
  acceptCodeRefType: boolean = false;

  categoriesNumber: number;
  categoriesName: string;
  categoriesTargetAcceptNumber: string;
  categoriesResult: string;
  Categories: Categories;
  categoriesRefType: boolean = false;

  areaName: string;
  areaDesc: string;
  Area: Area;
  areaRefType: boolean = false;

  subAreaName: string;
  subAreaDesc: string;
  selAreaId: any;
  areaList: any[];
  SubArea: SubArea;
  subAreaRefType: boolean = false;

  locationName: string;
  locationDesc: string;
  subAreaId: number;
  Location: Location;
  locationRefType: boolean = false;

  roleName: string;
  roleDesc: string;
  rId = '';
  roleData: any[];
  Roles: Roles;
  roleRefType: boolean = false;
  roleRidRefType: boolean = false;
  roleId: any;
  description: any;

  constructor(private apiService: ApiService, private utilities: UtilitiesService, private dialogRef: DynamicDialogRef, private dynamicDialogConfig: DynamicDialogConfig) { }

  ngOnInit(): void {
    if (this.dynamicDialogConfig.data.type == 'file type') {
      this.fileTypeRefType = true;
    } else if (this.dynamicDialogConfig.data.type == 'document type') {
      this.documentTypeRefType = true;
    } else if (this.dynamicDialogConfig.data.type == 'document sub type') {
      this.documentSubTypeRefType = true;
    } else if (this.dynamicDialogConfig.data.type == 'discipline') {
      this.disciplineRefType = true;
    } else if (this.dynamicDialogConfig.data.type == 'status') {
      this.statusRefType = true;
    } else if (this.dynamicDialogConfig.data.type == 'organizer') {
      this.organizerRefType = true;
    } else if (this.dynamicDialogConfig.data.type == 'recipient') {
      this.recipientRefType = true;
    } else if (this.dynamicDialogConfig.data.type == 'acceptance code') {
      this.acceptCodeRefType = true;
    } else if (this.dynamicDialogConfig.data.type == 'categories') {
      this.categoriesRefType = true;
    } else if (this.dynamicDialogConfig.data.type == 'area') {
      this.areaRefType = true;
    } else if (this.dynamicDialogConfig.data.type == 'sub area') {
      this.subAreaRefType = true;
      this.apiService.get(ApiURL.area).subscribe(data => {
        this.areaList = data.map(item => ({
          label: item.name,
          value: item.id,
        }));
      })
    } else if (this.dynamicDialogConfig.data.type == 'location') {
      this.locationRefType = true;
    } else if (this.dynamicDialogConfig.data.type == 'role') {
      if (this.dynamicDialogConfig.data.id) {
        this.roleRidRefType = true;
        this.rId = this.dynamicDialogConfig.data.id
        this.apiService.get(ApiURL.roles + '/' + this.rId).subscribe(result => {
          this.Roles = result;
          console.log(this.Roles)
        })
      } else {
        this.rId = '';
        this.roleRefType = true;
      }
    }
  }

  edited(e) { this.isDisabled = false; }

  onAreaChange(e) { this.isDisabled = false; }

  saveFileTypeRefStep() {
    let data = {
      name: this.fileTypeName,
      code: this.fileTypeCode,
      description: this.fileTypeDesc,
    }
    {
      this.apiService.post(ApiURL.files_types, data).subscribe((res: FilesType) => {
        if (res) {
          this.FilesType = res;
          this.utilities.notifySuccess('File Type Added Successfully');
          this.dialogRef.close(res);
        }
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happened.');
      })
    }
  }

  saveDocumentTypeRefStep() {
    let data = {
      name: this.documentTypeName,
      code: this.documentTypeCode,
      description: this.documentTypeDesc,
    }
    {
      this.apiService.post(ApiURL.documents_types, data).subscribe((res: DocumentsType) => {
        if (res) {
          this.DocumentsType = res;
          this.utilities.notifySuccess('Documents Type Added Successfully');
          this.dialogRef.close(res);
        }
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happened.');
      })
    }
  }

  saveDocumentSubTypeRefStep() {
    let data = {
      name: this.documentSubTypeName,
      code: this.documentSubTypeCode,
      description: this.documentSubTypeDesc,
    }
    {
      this.apiService.post(ApiURL.documents_sub_types, data).subscribe((res: DocumentSubType) => {
        if (res) {
          this.DocumentSubType = res;
          this.utilities.notifySuccess('Document Sub Type Added Successfully');
          this.dialogRef.close(res);
        }
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happened.');
      })
    }
  }

  saveDisciplineRefStep() {
    let data = {
      name: this.disciplineName,
      code: this.disciplineCode,
      description: this.disciplineDesc,
    }
    {
      this.apiService.post(ApiURL.discipline_id_refs, data).subscribe((res: Discipline) => {
        if (res) {
          this.Discipline = res;
          this.utilities.notifySuccess('Discipline Added Successfully');
          this.dialogRef.close(res);
        }
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happened.');
      })
    }
  }

  saveStatusRefStep() {
    let data = {
      name: this.statusName,
      code: this.statusCode,
      description: this.statusDesc,
    }
    {
      this.apiService.post(ApiURL.statuses, data).subscribe((res: Status) => {
        if (res) {
          this.Status = res;
          this.utilities.notifySuccess('Status Added Successfully');
          this.dialogRef.close(res);
        }
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happened.');
      })
    }
  }

  saveOrganizerRefStep() {
    let data = {
      name: this.organizerName,
      code: this.organizerCode,
      type: this.organizerType,
      description: this.organizerDesc,
    }
    {
      this.apiService.post(ApiURL.organizer, data).subscribe((res: Organizer) => {
        if (res) {
          this.Organizer = res;
          this.utilities.notifySuccess('Organizer Added Successfully');
          this.dialogRef.close(res);
        }
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happened.');
      })
    }
  }

  saveRecipientRefStep() {
    let data = {
      name: this.recipientName,
      code: this.recipientCode,
      type: this.recipientType,
      description: this.recipientDesc,
    }
    {
      this.apiService.post(ApiURL.recipientIdRefs, data).subscribe((res: Recipient) => {
        if (res) {
          this.Recipient = res;
          this.utilities.notifySuccess('Recipient Added Successfully');
          this.dialogRef.close(res);
        }
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happened.');
      })
    }
  }

  saveAcceptanceCodeRefStep() {
    let data = {
      number: this.acceptCodeNumber,
      name: this.acceptCodeName,
    }
    {
      this.apiService.post(ApiURL.acceptance_code, data).subscribe((res: AcceptanceCode) => {
        if (res) {
          this.AcceptanceCode = res;
          this.utilities.notifySuccess('Acceptance Code Added Successfully');
          this.dialogRef.close(res);
        }
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happened.');
      })
    }
  }

  saveCategoriesRefStep() {
    let data = {
      number: this.categoriesNumber,
      name: this.categoriesName,
      targetAcceptNumber: this.categoriesTargetAcceptNumber,
      result: this.categoriesResult,
    }
    {
      this.apiService.post(ApiURL.categories_id_refs, data).subscribe((res: Categories) => {
        if (res) {
          this.Categories = res;
          this.utilities.notifySuccess('Categories Added Successfully');
          this.dialogRef.close(res);
        }
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happened.');
      })
    }
  }

  saveAreaRefStep() {
    let data = {
      name: this.areaName,
      description: this.areaDesc,
    }
    {
      this.apiService.post(ApiURL.area, data).subscribe((res: Area) => {
        if (res) {
          this.Area = res;
          this.utilities.notifySuccess('Area Added Successfully');
          this.dialogRef.close(res);
        }
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happened.');
      })
    }
  }

  saveSubAreaRefStep() {
    let data = {
      name: this.subAreaName,
      description: this.subAreaDesc,
      // areaId: this.selAreaId.value,
    }
    {
      this.apiService.post(ApiURL.sub_area, data).subscribe((res: SubArea) => {
        if (res) {
          this.SubArea = res;
          this.utilities.notifySuccess('Sub Area Added Successfully');
          this.dialogRef.close(res);
        }
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happened.');
      })
    }
  }

  saveLocationRefStep() {
    let data = {
      name: this.locationName,
      description: this.locationDesc,
    }
    {
      this.apiService.post(ApiURL.location, data).subscribe((res: Location) => {
        if (res) {
          this.Location = res;
          this.utilities.notifySuccess('Location Added Successfully');
          this.dialogRef.close(res);
        }
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happened.');
      })
    }
  }

  saveRoleRefStep() {
    if(this.roleRefType) {
      let data = {
        roleId: this.roleName,
        description: this.roleDesc,
      }
      {
        this.apiService.post(ApiURL.roles, data).subscribe((res: Roles) => {
          if (res) {
            this.Roles = res;
            this.utilities.notifySuccess('Role Added Successfully');
            this.dialogRef.close(res);
          }
        }, (err) => {
          this.utilities.notifyError('Something Wrong Happened.');
        })
      }
    } else if (this.roleRidRefType) {
      let data = {
        roleId: this.Roles.roleId,
        description: this.Roles.description,
      }
      {
        this.apiService.put(ApiURL.roles + '/' + this.rId, data).subscribe((res: Roles) => {
          if (res) {
            this.Roles = res;
            this.utilities.notifySuccess('Role Updated Successfully');
            this.dialogRef.close(res);
          }
        }, (err) => {
          this.utilities.notifyError('Something Wrong Happened.');
        })
      }
    }

  }

}
