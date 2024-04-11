import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-file-folder-properties',
  templateUrl: './file-folder-properties.component.html',
  styleUrls: ['./file-folder-properties.component.scss']
})
export class FileFolderPropertiesComponent implements OnInit {

  properties: any;
  folderId: any;
  
  constructor(public config: DynamicDialogConfig, private cdref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.properties = this.config.data.properties;
    this.folderId = this.config.data.folderId;
  }
  
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

}
