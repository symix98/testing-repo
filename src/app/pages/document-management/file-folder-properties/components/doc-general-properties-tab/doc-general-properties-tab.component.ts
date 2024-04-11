import { Component, Input, OnInit } from '@angular/core';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-doc-general-properties-tab',
  templateUrl: './doc-general-properties-tab.component.html',
  styleUrls: ['./doc-general-properties-tab.component.scss']
})
export class DocGeneralPropertiesTabComponent implements OnInit {

  @Input() data: any;

  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit(): void { }

  downloadFile() {
    const documentArray: any[] = [this.data];
    this.utilitiesService.exportAsExcelFile(documentArray,'document-properties');
  }


}
