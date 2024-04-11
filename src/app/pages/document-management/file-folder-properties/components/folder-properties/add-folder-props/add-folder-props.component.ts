import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { FoldersPropertiesModel } from 'src/app/core/models/document-management/folder-properties.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-add-folder-props',
  templateUrl: './add-folder-props.component.html',
  styleUrls: ['./add-folder-props.component.scss']
})

export class AddFolderPropsComponent implements OnInit {

  isDisabled: boolean = true;
  isInputDisabled: boolean = false;

  foldId: number;
  folderPathName: string;
  folderPathValue: string;
  folderId: number;
  FoldersPropertiesModel: FoldersPropertiesModel;
  locationRefType: boolean = false;

  constructor(private apiService: ApiService, private utilities: UtilitiesService, private dialogRef: DynamicDialogRef, private dynamicDialogConfig: DynamicDialogConfig) { }

  ngOnInit(): void {
    let query: ApiQuery = new ApiQuery();
    query.filter = new Map<any, any>([['id', this.dynamicDialogConfig.data.folderId]])
    this.apiService.get(ApiURL.folders, query).subscribe((res: any[]) => {
      this.foldId = res[0].id;
    })
  }

  edited(e) { this.isDisabled = false; }

  saveAddFolderPathStep() {
    let data = {
      name: this.folderPathName,
      value: this.folderPathValue,
      folder: {
        id: this.foldId
      }
    }
    {
      this.apiService.post(ApiURL.folder_properties, data).subscribe((res: FoldersPropertiesModel) => {
        if (res) {
          this.FoldersPropertiesModel = res;
          this.utilities.notifySuccess('Attribute Added Successfully');
          this.dialogRef.close(res);
        }
      }, (err) => {
        this.utilities.notifyError('Something Wrong Happened.');
      })
    }
  }

}
