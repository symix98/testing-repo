import { Component, Input, OnInit } from '@angular/core';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-document-history',
  templateUrl: './document-history.component.html',
  styleUrls: ['./document-history.component.scss']
})
export class DocumentHistoryComponent implements OnInit {

  @Input() data:any
  historyDocuments:any[]
  selectedHistory:any
  constructor(private apiService : ApiService) { }

  ngOnInit(): void {
 
      let query : ApiQuery = new ApiQuery()
      query.filter = new Map<any,any>([['documentsNumber',this.data.documentsNumber]])
      this.apiService.get(ApiURL.documentss,query).subscribe(res =>{
        this.historyDocuments = res
      })
      
  }

}
