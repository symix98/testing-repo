import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { MtoLookupModel } from 'src/app/core/models/support-fab-models/mto-lookup.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-material-takeoff-form',
  templateUrl: './material-takeoff-form.component.html',
  styleUrls: ['./material-takeoff-form.component.scss']
})
export class MaterialTakeoffFormComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService : ApiService,
    private utilitiesService: UtilitiesService,
    private ref : DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,

  ) { }

  mtoForm:MtoLookupModel
  @Input() data : MtoLookupModel
  isLoading:boolean = false
  ngOnInit(): void {

    if(this.dynamicDialogConfig.data){
      this.mtoForm = this.dynamicDialogConfig.data
    }
    // let header = this.activatedRoute.snapshot.paramMap.get("id");
    // this.apiService.get(ApiURL.mto_lookups + "/" + header).subscribe((res:MtoLookupModel) =>{
    //   this.mtoForm = res
    // })
  }

  submitForm(){
    if(this.dynamicDialogConfig.data){
      this.apiService.put(ApiURL.mto_lookups + "/" + this.mtoForm.id , this.mtoForm).subscribe(res =>{
        this.utilitiesService.notifySuccess("Updated Successfully!");
        this.ref.close(true)
      },
      (err)=>{
        console.log(err)
        this.utilitiesService.notifyError(err?.error?.detail)
      })
    }
  }
  

}
