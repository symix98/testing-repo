import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { DataViewParameter } from 'src/app/core/models/data-view-model/dataview-parameter.model';
import { ProductParameter } from 'src/app/core/models/data-view-model/product-parameter.model';
import { SupportPictorialFormComponent } from './components/support-pictorial-form/support-pictorial-form.component';

@Component({
  selector: 'app-support-pictorial',
  templateUrl: './support-pictorial.component.html',
  styleUrls: ['./support-pictorial.component.scss']
})
export class SupportPictorialComponent implements OnInit {

  dataViewParam: DataViewParameter

  constructor(
    private dialogService :DialogService
  ) { }

  ngOnInit(): void {
    this.initDataViewParams()
  }

  initDataViewParams() {
    let param: DataViewParameter = new DataViewParameter();
    param.api = ApiURL.supports_pictorial_refs
    param.dataKey = 'id';
    param.sort = "type,asc"
    param.rowPerPageDefault = 9
    param.productsCard = this.generateCard()
    param.onRowSelected = this.onRowSelected;
    param.filterBox = {
      label: 'Search By',
      field: ['name',
    'type']
    }
    param.paginator = true
    this.dataViewParam = param
  }

  generateCard(): ProductParameter {
    let product: ProductParameter = new ProductParameter();
    product.class = 'type'
    product.title = 'name'
    product.desc = 'description'
    product.image = 'picture'
    product.imageContentType = 'pictureContentType'
    // product.info = {
    //   object: 'createdBy',
    //   supplier: 'date',
    //   email: 'emailid',
    //   number: 'contactno',
    //   name: 'contactname'   
    // }
    // product.cost = 'id',
    // product.rating = "id"
    return product;
  }
  addNewSupport(){

    this.dialogService.open(SupportPictorialFormComponent, {
      header : 'Add New Support Component',
      width : '70%',
      height : '60%',

    }).onClose.subscribe(res =>{
      if(res){
        this.dataViewParam = null
        setTimeout(() => {
          this.initDataViewParams()
        }, 10);
      }
      
    })

  }

  onRowSelected = (event): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.dialogService.open(SupportPictorialFormComponent, {
      header : 'Add New Support Component',
      width : '70%',
      height : '60%',
      data : event

    }).onClose.subscribe(res =>{
      if(res){
        this.dataViewParam = null
        setTimeout(() => {
          this.initDataViewParams()
        }, 10);
      }
      
    })

      resolve();
    });
  }

}
