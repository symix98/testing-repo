import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { MtoLookupModel } from 'src/app/core/models/support-fab-models/mto-lookup.model';
import { SupportPictorial } from 'src/app/core/models/support-fab-models/support-pictorial.model';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-mat-takeoff-forms',
  templateUrl: './mat-takeoff-forms.component.html',
  styleUrls: ['./mat-takeoff-forms.component.scss']
})
export class MatTakeoffFormsComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService : ApiService
  ) { }
  mtoForm:MtoLookupModel
  picture :SupportPictorial
  isLoading:boolean = false
  isDisable :boolean = true
  show:boolean =false
  image:{h:string,w:string} = {h:'150',w:'200'};
  items: MenuItem[];
  activeIndex:number = 1

  ngOnInit(): void {
    let header = this.activatedRoute.snapshot.paramMap.get("id");
    this.apiService.get(ApiURL.mto_lookups + "/" + header).subscribe((res:MtoLookupModel) =>{
      this.mtoForm = res
      this.getRelatedPic(this.mtoForm.category)
    })
    this.items = [
      {label: 'Items', icon: 'pi pi-fw pi-list'},
  ];
  }

  getRelatedPic(category){
    let query: ApiQuery = new ApiQuery()
    query.contains = new Map<any,any>([['type',category]])
    this.apiService.get(ApiURL.supports_pictorial_refs,query).subscribe((res:SupportPictorial[]) =>{
      if(res.length){
        if(res.length > 1){
          res.forEach(pic =>{
            if(pic.type.startsWith(category)){
              this.picture= pic
            }
          })
          if(!this.picture){
            this.picture = res[0]
          }
        }
        else{
          this.picture = res[0]
        }
        
      }
      
    })

  }

  submitForm(){
    console.log(this.mtoForm)
  }
  onEdit(){
    this.isDisable = !this.isDisable
  }
}
