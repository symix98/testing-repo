import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-document-form-wizzard',
  templateUrl: './document-form-wizzard.component.html',
  styleUrls: ['./document-form-wizzard.component.scss'],
  providers: [MessageService],
})
export class DocumentFormWizzardComponent implements OnInit {

  items: MenuItem[];
    
    subscription: Subscription;

    constructor(public messageService: MessageService, private router: Router) {}

    ngOnInit() {
        this.items = [{
                label: 'Document Numbering',
                routerLink: 'documents/document-numbering'
            },
            {
                label: 'Document Properties',
                routerLink: 'documents/document-properties'
            },
        ];
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
