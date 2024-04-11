import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-reference-components',
  templateUrl: './reference-components.component.html',
  styleUrls: ['./reference-components.component.scss']
})

export class ReferenceComponentsComponent implements OnInit {

  isLoading: any;
  selectedRefTableName: any;
  referenceTablesList: any[];

  constructor() { }

  ngOnInit(): void {
    this.referenceTablesList = [
      { name: 'Files Type', code: 'Files Type' },
      { name: 'Documet Type', code: 'Documet Type' },
      { name: 'Document Sub Type', code: 'Document Sub Type' },
      { name: 'Discipline', code: 'Discipline' },
      { name: 'Status', code: 'Status' },
      { name: 'Organizer', code: 'Organizer' },
      { name: 'Recipient', code: 'Recipient' },
      { name: 'Acceptance Code', code: 'Acceptance Code' },
      { name: 'Categories', code: 'Categories' },
      { name: 'Location', code: 'Location' },
      { name: 'Area', code: 'Area' },
      { name: 'Sub Area', code: 'Sub Area' },
    ];
  }

  onRefTableSelected(event) { }

}
