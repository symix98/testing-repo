import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { UtilitiesService } from 'src/app/core/services/utilities.service';


@Component({
  selector: 'app-document-track',
  templateUrl: './document-track.component.html',
  styleUrls: ['./document-track.component.scss']
})

export class DocumentTrackComponent implements OnInit {

  documentid: String;
  documentData: any;
  formType: String;

  constructor(private router : Router, private activatedRouteService : ActivatedRoute) { }

  ngOnInit(): void {
    this.documentid = this.activatedRouteService.snapshot.paramMap.get('id');
    this.formType = this.activatedRouteService.snapshot.paramMap.get('formType');
  }

}
